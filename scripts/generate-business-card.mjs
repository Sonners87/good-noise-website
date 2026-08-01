import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'print', 'business-card');
mkdirSync(OUT_DIR, { recursive: true });

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
const SAFE_HEIGHT = SAFE_Y1 - SAFE_Y0;
const CENTER_X = CANVAS_W / 2; // 32.5

// --- Brand ----------------------------------------------------------------
const COLOR_CREAM = '#f2ede4';
const COLOR_BRAND = '#1f3d2e';
const COLOR_SAGE = '#a7bfa4';
const COLOR_TERRACOTTA = '#e46a3a';
const FONT = 'Inter';
const CAP_RATIO = 0.7275; // measured Inter cap-height / font-size ratio (all weights)
const ASCENT_RATIO = 0.969;
const DESCENT_RATIO = 0.241;

// --- Source assets ----------------------------------------------------------------
// The logo SVG's single path is reused for every variant; only the fill
// color changes, so there's no need for separate light/dark source files.
const logoSvg = readFileSync(path.join(ROOT, 'src/assets/logo/good-noise-logo-forest.svg'), 'utf8');
const logoPathD = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const [, , LOGO_VB_W, LOGO_VB_H] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

const qrSvg = readFileSync(path.join(ROOT, 'public/qr-code/good-noise-qr.svg'), 'utf8');
const qrPathD = qrSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const [, , QR_VB_W, QR_VB_H] = qrSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);

// --- Shared layout constants (mm), tuned to fit the safe area ------------
const SCALE = 0.8; // logo/tagline/QR all at 80% of the original v1 sizes
const GAP = 6; // logo -> tagline -> QR
const GAP_CAPTION = 3; // QR -> CTA (tighter: it's a caption on the QR, not a peer element)

const LOGO_W = 28 * SCALE;
const LOGO_H = (LOGO_W * LOGO_VB_H) / LOGO_VB_W;

const TAGLINE_SIZE = 3.8 * SCALE;
const TAGLINE_LINES = ['Youth music programs', 'in Perth.'];
const TAGLINE_PITCH = TAGLINE_SIZE * 1.2;
const TAGLINE_BLOCK_H = TAGLINE_SIZE * (ASCENT_RATIO + DESCENT_RATIO) + TAGLINE_PITCH * (TAGLINE_LINES.length - 1);

const QR_SIZE = 25 * SCALE; // 20mm

// Much smaller than the tagline (2.21mm cap height) so it reads as a quiet
// caption on the QR rather than competing with the tagline for attention.
const CTA_SIZE = 2.0;
const CTA_LINES = ['Scan for upcoming workshops'];
const CTA_BLOCK_H = CTA_SIZE * (ASCENT_RATIO + DESCENT_RATIO);

const logoScale = LOGO_W / LOGO_VB_W;
const logoX = CENTER_X - LOGO_W / 2;
const qrScale = QR_SIZE / QR_VB_W;
const qrX = CENTER_X - QR_SIZE / 2;

function textBlock({ id, lines, size, pitch, top, color, weight }) {
  const ascent = size * ASCENT_RATIO;
  return lines
    .map((line, i) => {
      const baseline = top + ascent + i * pitch;
      return `<text id="${id}-l${i}" x="${CENTER_X}" y="${baseline.toFixed(3)}" text-anchor="middle" font-family="${FONT}" font-weight="${weight}" font-size="${size}" fill="${color}">${line}</text>`;
    })
    .join('\n    ');
}

// --- Variants --------------------------------------------------------------
const VARIANTS = [
  {
    key: 'base',
    file: 'good-noise-business-card.pdf',
    background: COLOR_CREAM,
    logoColor: COLOR_BRAND,
    taglineColor: COLOR_TERRACOTTA,
    qrColor: COLOR_BRAND,
    includeCta: false,
  },
  {
    key: 'cta',
    file: 'good-noise-business-card-cta.pdf',
    background: COLOR_CREAM,
    logoColor: COLOR_BRAND,
    taglineColor: COLOR_TERRACOTTA,
    qrColor: COLOR_BRAND,
    includeCta: true,
    ctaColor: COLOR_BRAND, // same family as logo/QR, distinct from the terracotta tagline
  },
  {
    key: 'forest',
    file: 'good-noise-business-card-forest.pdf',
    background: COLOR_BRAND,
    logoColor: COLOR_CREAM, // forest-on-forest would be invisible, so this inverts to cream
    taglineColor: COLOR_TERRACOTTA, // already high-contrast on forest (same pattern as the site's Hero)
    qrColor: COLOR_CREAM, // must also invert: a forest QR on a forest bg wouldn't scan
    includeCta: true,
    ctaColor: COLOR_SAGE, // secondary brand color, keeps CTA visually distinct from logo and tagline
  },
];

function buildSvg(variant) {
  const totalH = variant.includeCta
    ? LOGO_H + GAP + TAGLINE_BLOCK_H + GAP + QR_SIZE + GAP_CAPTION + CTA_BLOCK_H
    : LOGO_H + GAP + TAGLINE_BLOCK_H + GAP + QR_SIZE;
  const logoTop = SAFE_Y0 + (SAFE_HEIGHT - totalH) / 2;
  const taglineTop = logoTop + LOGO_H + GAP;
  const qrTop = taglineTop + TAGLINE_BLOCK_H + GAP;
  const ctaTop = qrTop + QR_SIZE + GAP_CAPTION;

  const positions = { logoTop, taglineTop, qrTop, ctaTop: variant.includeCta ? ctaTop : null };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}mm" height="${CANVAS_H}mm" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <rect id="bg" x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="${variant.background}"/>
  <g id="logo" transform="translate(${logoX.toFixed(3)},${logoTop.toFixed(3)}) scale(${logoScale.toFixed(6)})">
    <path fill="${variant.logoColor}" d="${logoPathD}"/>
  </g>
  <g id="tagline">
    ${textBlock({ id: 'tagline', lines: TAGLINE_LINES, size: TAGLINE_SIZE, pitch: TAGLINE_PITCH, top: taglineTop, color: variant.taglineColor, weight: 600 })}
  </g>
  <g id="qr" transform="translate(${qrX.toFixed(3)},${qrTop.toFixed(3)}) scale(${qrScale.toFixed(6)})">
    <path fill="none" stroke="${variant.qrColor}" d="${qrPathD}"/>
  </g>
  ${
    variant.includeCta
      ? `<g id="cta">
    ${textBlock({ id: 'cta', lines: CTA_LINES, size: CTA_SIZE, pitch: 0, top: ctaTop, color: variant.ctaColor, weight: 600 })}
  </g>`
      : ''
  }
</svg>`;

  return { svg, positions };
}

async function renderVariant(browser, variant) {
  console.log(`\n=== Variant: ${variant.key} (${variant.file}) ===`);
  const TMP_DIR = mkdtempSync(path.join(tmpdir(), `good-noise-card-${variant.key}-`));
  const { svg, positions } = buildSvg(variant);

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

  const page = await browser.newPage({ deviceScaleFactor: 4 });
  await page.setContent(html);
  await page.evaluate(async () => {
    await document.fonts.load('600 16px Inter');
    await document.fonts.ready;
  });
  await page.waitForTimeout(200);

  // --- Verification: measure real ink bounding boxes in mm -----------------
  const report = await page.evaluate(
    ({ SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1, CANVAS_W, CANVAS_H, ids }) => {
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
    {
      SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1, CANVAS_W, CANVAS_H,
      ids: variant.includeCta ? ['logo', 'tagline', 'qr', 'cta'] : ['logo', 'tagline', 'qr'],
    },
  );

  console.log('Cap heights (mm): tagline', (TAGLINE_SIZE * CAP_RATIO).toFixed(2), variant.includeCta ? `cta ${(CTA_SIZE * CAP_RATIO).toFixed(2)}` : '(no cta)');

  const BG_TOL = 0.02;
  if (
    Math.abs(report.bg.x0) > BG_TOL ||
    Math.abs(report.bg.y0) > BG_TOL ||
    Math.abs(report.bg.x1 - CANVAS_W) > BG_TOL ||
    Math.abs(report.bg.y1 - CANVAS_H) > BG_TOL
  ) {
    throw new Error(`[${variant.key}] Background does not cover the full bleed canvas: ` + JSON.stringify(report.bg));
  }
  if (report.safeViolations.length > 0) {
    throw new Error(`[${variant.key}] Safe margin violated: ` + JSON.stringify(report.safeViolations, null, 2));
  }
  console.log('QR nominal placement (mm):', { x0: qrX, y0: positions.qrTop, x1: qrX + QR_SIZE, y1: positions.qrTop + QR_SIZE, size: QR_SIZE });
  console.log(`[${variant.key}] All safe-margin and geometry checks passed.`);

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

  await page.close();

  // --- Convert to CMYK + pin exact media size via Ghostscript ---------------
  const PT_PER_MM = 72 / 25.4;
  const widthPt = (CANVAS_W * PT_PER_MM).toFixed(6);
  const heightPt = (CANVAS_H * PT_PER_MM).toFixed(6);
  const finalPdfPath = path.join(OUT_DIR, variant.file);

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

  console.log(`[${variant.key}] Final print-ready CMYK PDF written to`, finalPdfPath);
  rmSync(TMP_DIR, { recursive: true, force: true });
}

const browser = await chromium.launch();
for (const variant of VARIANTS) {
  await renderVariant(browser, variant);
}
await browser.close();
