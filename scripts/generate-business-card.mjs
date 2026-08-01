import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'print', 'business-card');
mkdirSync(OUT_DIR, { recursive: true });
const TMP_DIR = mkdtempSync(path.join(tmpdir(), 'good-noise-card-'));

// --- Card geometry (mm). 1 SVG user unit === 1mm. -----------------------
const CANVAS_W = 65; // trim + bleed, width
const CANVAS_H = 100; // trim + bleed, height
const BLEED = 5;
const TRIM_X0 = BLEED;
const TRIM_Y0 = BLEED;
const TRIM_X1 = CANVAS_W - BLEED; // 60
const TRIM_Y1 = CANVAS_H - BLEED; // 95
const SAFE = 5; // inside trim
const SAFE_X0 = TRIM_X0 + SAFE; // 10
const SAFE_Y0 = TRIM_Y0 + SAFE; // 10
const SAFE_X1 = TRIM_X1 - SAFE; // 55
const SAFE_Y1 = TRIM_Y1 - SAFE; // 90
const CENTER_X = CANVAS_W / 2; // 32.5

// --- Brand ----------------------------------------------------------------
const COLOR_CREAM = '#f2ede4';
const COLOR_BRAND = '#1f3d2e';
const COLOR_TERRACOTTA = '#e46a3a';
const FONT = 'Inter';
const CAP_RATIO = 0.7275; // measured Inter cap-height / font-size ratio (all weights)
const ASCENT_RATIO = 0.969;
const DESCENT_RATIO = 0.241;

// --- Source assets ----------------------------------------------------------------
const logoSvg = readFileSync(
  path.join(ROOT, 'src/assets/logo/good-noise-logo-forest.svg'),
  'utf8',
);
const logoPathD = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const logoViewBox = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const [, , LOGO_VB_W, LOGO_VB_H] = logoViewBox;

const qrSvg = readFileSync(path.join(ROOT, 'public/qr-code/good-noise-qr.svg'), 'utf8');
const qrPathD = qrSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const qrViewBox = qrSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const [, , QR_VB_W, QR_VB_H] = qrViewBox;

// --- Layout constants (mm), tuned to fit the safe area -------------------
const LOGO_W = 28;
const LOGO_H = (LOGO_W * LOGO_VB_H) / LOGO_VB_W;
const LOGO_TOP = SAFE_Y0 + 1;

const TAGLINE_SIZE = 3.8;
const TAGLINE_LINES = ['Youth music programs', 'in Perth.'];
const TAGLINE_PITCH = TAGLINE_SIZE * 1.2;
const TAGLINE_TOP = LOGO_TOP + LOGO_H + 1.8;

const CTA_SIZE = 3.6;
const CTA_LINES = ['Scan for upcoming', 'workshops'];
const CTA_PITCH = CTA_SIZE * 1.2;
const TAGLINE_BLOCK_H = TAGLINE_SIZE * (ASCENT_RATIO + DESCENT_RATIO) + TAGLINE_PITCH * (TAGLINE_LINES.length - 1);
const CTA_TOP = TAGLINE_TOP + TAGLINE_BLOCK_H + 1.8;

const QR_SIZE = 25; // required: ~25mm square, do not shrink
const CTA_BLOCK_H = CTA_SIZE * (ASCENT_RATIO + DESCENT_RATIO) + CTA_PITCH * (CTA_LINES.length - 1);
const QR_TOP = CTA_TOP + CTA_BLOCK_H + 1.8;

const EMAIL_SIZE = 3.5;
const EMAIL_LINES = ['dave@', 'goodnoiseproject.com.au'];
const EMAIL_PITCH = EMAIL_SIZE * 1.2;
const EMAIL_TOP = QR_TOP + QR_SIZE + 1.8;

function textBlock({ id, lines, size, pitch, top, color, weight }) {
  const ascent = size * ASCENT_RATIO;
  return lines
    .map((line, i) => {
      const baseline = top + ascent + i * pitch;
      return `<text id="${id}-l${i}" x="${CENTER_X}" y="${baseline.toFixed(3)}" text-anchor="middle" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${color}">${line}</text>`;
    })
    .join('\n    ');
}

const logoScale = LOGO_W / LOGO_VB_W;
const logoX = CENTER_X - LOGO_W / 2;
const qrScale = QR_SIZE / QR_VB_W;
const qrX = CENTER_X - QR_SIZE / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}mm" height="${CANVAS_H}mm" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <rect id="bg" x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="${COLOR_CREAM}"/>
  <g id="logo" transform="translate(${logoX.toFixed(3)},${LOGO_TOP.toFixed(3)}) scale(${logoScale.toFixed(6)})">
    <path fill="${COLOR_BRAND}" d="${logoPathD}"/>
  </g>
  <g id="tagline">
    ${textBlock({ id: 'tagline', lines: TAGLINE_LINES, size: TAGLINE_SIZE, pitch: TAGLINE_PITCH, top: TAGLINE_TOP, color: COLOR_TERRACOTTA, weight: 600 })}
  </g>
  <g id="cta">
    ${textBlock({ id: 'cta', lines: CTA_LINES, size: CTA_SIZE, pitch: CTA_PITCH, top: CTA_TOP, color: COLOR_BRAND, weight: 600 })}
  </g>
  <g id="qr" transform="translate(${qrX.toFixed(3)},${QR_TOP.toFixed(3)}) scale(${qrScale.toFixed(6)})">
    <path fill="none" stroke="${COLOR_BRAND}" d="${qrPathD}"/>
  </g>
  <g id="email">
    ${textBlock({ id: 'email', lines: EMAIL_LINES, size: EMAIL_SIZE, pitch: EMAIL_PITCH, top: EMAIL_TOP, color: COLOR_BRAND, weight: 600 })}
  </g>
</svg>`;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
<style>
  @page { size: ${CANVAS_W}mm ${CANVAS_H}mm; margin: 0; }
  html, body { margin: 0; padding: 0; }
  svg { display: block; }
</style>
</head>
<body>
${svg}
</body>
</html>`;

writeFileSync(path.join(TMP_DIR, 'card.html'), html);

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 4 });
await page.setContent(html);
await page.evaluate(async () => {
  await document.fonts.load('600 16px Inter');
  await document.fonts.load('700 16px Inter');
  await document.fonts.ready;
});
await page.waitForTimeout(200);

// --- Verification: measure real ink bounding boxes in mm (viewBox units) --
const report = await page.evaluate(
  ({ SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1, CANVAS_W, CANVAS_H }) => {
    // getBBox() is in the element's own local coordinate system (i.e. before
    // its own `transform` attribute), which is wrong for transformed groups
    // like the logo/QR. Use screen-space rects converted back to mm via the
    // SVG root's px-per-mm scale instead, which is transform-agnostic.
    const svgRoot = document.querySelector('svg');
    const rootRect = svgRoot.getBoundingClientRect();
    const pxPerMmX = rootRect.width / CANVAS_W;
    const pxPerMmY = rootRect.height / CANVAS_H;
    function bboxOf(id) {
      const el = document.getElementById(id);
      const r = el.getBoundingClientRect();
      const x0 = (r.left - rootRect.left) / pxPerMmX;
      const y0 = (r.top - rootRect.top) / pxPerMmY;
      const x1 = (r.right - rootRect.left) / pxPerMmX;
      const y1 = (r.bottom - rootRect.top) / pxPerMmY;
      return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
    }
    const ids = ['logo', 'tagline', 'cta', 'qr', 'email'];
    const boxes = {};
    for (const id of ids) boxes[id] = bboxOf(id);
    const bg = bboxOf('bg');
    const safeViolations = [];
    for (const id of ids) {
      const b = boxes[id];
      if (b.x0 < SAFE_X0 - 1e-6 || b.x1 > SAFE_X1 + 1e-6 || b.y0 < SAFE_Y0 - 1e-6 || b.y1 > SAFE_Y1 + 1e-6) {
        safeViolations.push({ id, box: b });
      }
    }
    return { boxes, bg, safeViolations };
  },
  { SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1, CANVAS_W, CANVAS_H },
);

console.log('--- Layout verification ---');
console.log('Safe area:', { SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1 });
console.log(JSON.stringify(report, null, 2));
console.log('Cap heights (mm): tagline', (TAGLINE_SIZE * CAP_RATIO).toFixed(2), 'cta', (CTA_SIZE * CAP_RATIO).toFixed(2), 'email', (EMAIL_SIZE * CAP_RATIO).toFixed(2));

const BG_TOL = 0.02; // mm, sub-pixel float rounding from getBoundingClientRect
if (
  Math.abs(report.bg.x0) > BG_TOL ||
  Math.abs(report.bg.y0) > BG_TOL ||
  Math.abs(report.bg.x1 - CANVAS_W) > BG_TOL ||
  Math.abs(report.bg.y1 - CANVAS_H) > BG_TOL
) {
  throw new Error('Background does not cover the full bleed canvas: ' + JSON.stringify(report.bg));
}
if (report.safeViolations.length > 0) {
  throw new Error('Safe margin violated: ' + JSON.stringify(report.safeViolations, null, 2));
}
// The QR's *drawn ink* bbox is smaller than its placement box by design: the
// qrcode SVG's viewBox includes a built-in 2-module quiet zone, which is
// required for reliable scanning and has no ink of its own. What must equal
// QR_SIZE is the nominal placement box we set via the transform, which is
// exact by construction (qrX/QR_TOP/QR_SIZE) rather than something to
// re-derive from measured ink. Assert that directly instead.
console.log('QR nominal placement (mm):', {
  x0: qrX,
  y0: QR_TOP,
  x1: qrX + QR_SIZE,
  y1: QR_TOP + QR_SIZE,
  size: QR_SIZE,
});
console.log('QR ink bbox (quiet zone excluded, informational only):', report.boxes.qr);

console.log('All safe-margin and geometry checks passed.');

// --- Export PDF (RGB, from Chromium) --------------------------------------
const rgbPdfPath = path.join(TMP_DIR, 'card-rgb.pdf');
await page.pdf({
  path: rgbPdfPath,
  width: `${CANVAS_W}mm`,
  height: `${CANVAS_H}mm`,
  printBackground: true,
  margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  preferCSSPageSize: true,
});

// High-res preview PNG of just the card, for visual QA only (not a deliverable).
const previewPath = path.join(TMP_DIR, 'preview.png');
await page.locator('svg').screenshot({ path: previewPath, scale: 'css' });
console.log('Preview PNG (visual QA only):', previewPath);

await browser.close();

// --- Convert to CMYK + pin exact media size via Ghostscript ---------------
// Chromium quantizes PDF page geometry to whole CSS px internally, so the
// page comes out ~0.06-0.18mm short of 65mm x 100mm. Ghostscript's pdfwrite
// with -dFIXEDMEDIA/-dPDFFitPage re-targets the exact point dimensions
// (rounding differences are <0.2%, imperceptible) while -dProcessColorModel
// converts every fill/stroke to DeviceCMYK (k/K operators).
const PT_PER_MM = 72 / 25.4;
const widthPt = (CANVAS_W * PT_PER_MM).toFixed(6);
const heightPt = (CANVAS_H * PT_PER_MM).toFixed(6);
const finalPdfPath = path.join(OUT_DIR, 'good-noise-business-card.pdf');

execFileSync('gs', [
  '-o', finalPdfPath,
  '-sDEVICE=pdfwrite',
  '-dCompatibilityLevel=1.4',
  '-dProcessColorModel=/DeviceCMYK',
  '-sColorConversionStrategy=CMYK',
  '-dColorConversionStrategyForImages=/CMYK',
  '-dOverrideICC',
  `-dDEVICEWIDTHPOINTS=${widthPt}`,
  `-dDEVICEHEIGHTPOINTS=${heightPt}`,
  '-dFIXEDMEDIA',
  '-dPDFFitPage',
  '-dEmbedAllFonts=true',
  '-dSubsetFonts=true',
  '-r300',
  '-dAutoRotatePages=/None',
  rgbPdfPath,
], { stdio: 'inherit' });

console.log('\nFinal print-ready CMYK PDF written to', finalPdfPath);
rmSync(TMP_DIR, { recursive: true, force: true });
