// v8 flyer — "Good Noise Music Makers, Spring Holiday Jam Program".
// A4 print-ready PNG (300dpi, 2480x3508px) + CMYK PDF. Trim-only canvas, no
// bleed, per the brief's exact pixel spec.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import QRCode from 'qrcode';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'print', 'flyer', 'outputs');
mkdirSync(OUT_DIR, { recursive: true });

// --- Page geometry (mm). A4 trim, no bleed — brief specifies exact
// 2480x3508px @ 300dpi, which is A4 trim size with no bleed margin. ---------
const CANVAS_W = 210;
const CANVAS_H = 297;
const BORDER = 6; // white frame thickness, matching v7

const BW = process.argv.includes('--bw');
const SUFFIX = BW ? '-bw' : '';

// --- Brand colors, sampled from the v7 flyer per the brief -----------------
const COLOR_GREEN = '#2D493B';
const COLOR_ORANGE = '#E46A3A';
const COLOR_SAGE = '#a7bfa4';

// --- B&W palette. Orange text -> white; green/sage text -> a light grey,
// except the QR caption/URL, which sit on the white QR card and need to stay
// dark for legibility (light grey there would be near-invisible). The QR
// code's own dark modules stay black rather than light grey too, since a
// low-contrast QR code risks not scanning. -----------------------------------
const COLOR_TEXT_ORANGE = BW ? '#ffffff' : COLOR_ORANGE;
const COLOR_TEXT_GREEN_ON_DARK = BW ? '#d6d6d6' : COLOR_SAGE;
const COLOR_TEXT_GREEN_ON_WHITE = BW ? '#1a1a1a' : COLOR_GREEN;
const COLOR_WASH = BW ? '#141414' : COLOR_GREEN;
const COLOR_BADGE_BG = BW ? '#141414' : COLOR_ORANGE;
const COLOR_QR_DARK = BW ? '#000000' : COLOR_GREEN;

function fileToDataUri(absPath, mime) {
  return `data:${mime};base64,${readFileSync(absPath).toString('base64')}`;
}

const logoSvg = readFileSync(path.join(ROOT, 'src/assets/logo/good-noise-logo-forest.svg'), 'utf8');
const logoPathD = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const [, , LOGO_VB_W, LOGO_VB_H] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const logoAspect = LOGO_VB_H / LOGO_VB_W;

const TEXTURE_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/rough-texture-v8.png'), 'image/png');
// Source art supplied already background-free with its sage overlay applied
// (no further color treatment here) — just cropped tight to its content
// bounding box. Baked into the PNG rather than a live CSS blend, per the
// H1-title fix above: CSS blend-mode/clip tricks aren't trustworthy through
// the print-to-PDF path. Natural aspect ratio (2329x834, ~2.79) is preserved
// via width:100%/height:auto below; alpha edges are untouched for crispness.
const HANDS_FILE = BW ? 'hero-instruments-overlay-4-bnw.png' : 'hero-instruments-overlay-4.png';
const HANDS_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures', HANDS_FILE), 'image/png');

const QR_URL = 'https://goodnoiseproject.com.au/workshops/2026-spring-holidays'
  + `?utm_source=${BW ? 'flyerBnW' : 'flyer'}&utm_medium=print&utm_campaign=2026-spring-holidays-jam-program`;
const qrSvg = await QRCode.toString(QR_URL, {
  type: 'svg', errorCorrectionLevel: 'Q', margin: 0,
  color: { dark: COLOR_QR_DARK, light: '#00000000' },
});

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fjalla+One&family=Anton&display=swap';

const FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${GOOGLE_FONTS_URL}" rel="stylesheet">`;

const INSET_W = CANVAS_W - BORDER * 2;
const INSET_H = CANVAS_H - BORDER * 2;
const HANDS_ASPECT = 2329 / 834; // source crop's width/height (see textures/hero-instruments-overlay-4.png prep)
const PHOTO_W = INSET_W; // fills the inset edge-to-edge, no cropping — full artwork stays visible
const PHOTO_H = PHOTO_W / HANDS_ASPECT; // bottom-anchored hero band, height follows from the source aspect

// CSS mm is always defined relative to 96dpi, regardless of deviceScaleFactor
// — viewports must be sized in that reference frame or mm-sized content
// overflows/clips. deviceScaleFactor is what actually buys extra resolution.
const CSS_PX_PER_MM = 96 / 25.4;
const CSS_PX_TO_MM = 25.4 / 96;
const PT_PER_MM = 72 / 25.4;
const widthPt = (CANVAS_W * PT_PER_MM).toFixed(6);
const heightPt = (CANVAS_H * PT_PER_MM).toFixed(6);

const browser = await chromium.launch();

// --- Pre-render the H1 title as a flat raster image -------------------------
// `background-clip: text` + `background-blend-mode: multiply` renders
// correctly through Chromium's normal screenshot path, but loses its text
// clip in Chromium's print-to-PDF export once Ghostscript reprocesses the
// result for CMYK: Apple's Quartz/PDFKit renderer (Preview, Quick Look, and
// likely other print-shop RIPs) then paints the full untouched background
// rectangle instead of clipping it to the letterforms. This is the same
// failure mode the v7 script hit with `mask-image` (see the comment above
// GUITAR_ICON_SAGE_DATA_URI in generate-flyer-v7-experiments.mjs) — the
// on-screen/screenshot path can't be trusted to predict the print-to-PDF
// path. Fix: rasterize the title once via a plain screenshot (which is the
// path that renders correctly) and embed the result as a normal <img> in
// both the PNG and PDF pipelines, so there's no clip/blend trick left for
// either exporter to mishandle.
// BW mode drops the texture-multiply layer: multiplying it against white is
// a no-op (multiply-by-white = identity), so it'd render the raw texture
// image instead of solid white. Flat white fill only.
const h1BackgroundCss = BW
  ? `background-image: linear-gradient(${COLOR_TEXT_ORANGE}, ${COLOR_TEXT_ORANGE});
    background-size: 100% 100%;
    background-position: center;`
  : `background-image: linear-gradient(${COLOR_TEXT_ORANGE}, ${COLOR_TEXT_ORANGE}), url("${TEXTURE_DATA_URI}");
    background-size: 100% 100%, cover;
    background-position: center, center;
    background-blend-mode: multiply, normal;`;
const h1Html = `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .h1 {
    display: inline-block;
    font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase;
    line-height: 0.96;
    ${h1BackgroundCss}
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .h1-line1 { font-size: 14.5mm; letter-spacing: 0.08em; white-space: nowrap; }
  .h1-line2 { font-size: 26mm; letter-spacing: 0.012em; white-space: nowrap; }
  </style></head><body>
  <div class="h1"><div class="h1-line1">2026 Spring Holidays</div><div class="h1-line2">Jam Program</div></div>
  </body></html>`;
const h1Page = await browser.newPage({ deviceScaleFactor: 4, viewport: { width: 900, height: 300 } });
await h1Page.setContent(h1Html);
await h1Page.evaluate(async () => {
  await document.fonts.load('400 16px "Anton"');
  await document.fonts.ready;
});
await h1Page.waitForTimeout(200);
const h1Rect = await h1Page.evaluate(() => {
  const r = document.querySelector('.h1').getBoundingClientRect();
  return { width: r.width, height: r.height };
});
const h1ImageBuffer = await h1Page.locator('.h1').screenshot({ omitBackground: true });
await h1Page.close();
const H1_IMAGE_DATA_URI = `data:image/png;base64,${h1ImageBuffer.toString('base64')}`;
const H1_IMG_W_MM = (h1Rect.width * CSS_PX_TO_MM).toFixed(3);
const H1_IMG_H_MM = (h1Rect.height * CSS_PX_TO_MM).toFixed(3);

function renderHtml({
  badgeBottomMm, badgeRightMm,
  contentPaddingTopMm = 5, logoWidthMm = 18, presentsMarginTopMm = 9, h1MarginTopMm = 9,
}) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  @page { size: ${CANVAS_W}mm ${CANVAS_H}mm; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { width: ${CANVAS_W}mm; height: ${CANVAS_H}mm; font-family: 'Fjalla One', sans-serif; }
  .page { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .border { position: absolute; inset: 0; background: #ffffff; }
  .inset { position: absolute; inset: ${BORDER}mm; overflow: hidden; }
  .texture {
    position: absolute; inset: 0;
    background-image: url("${TEXTURE_DATA_URI}"); background-size: cover; background-position: center;
  }
  .green-wash { position: absolute; inset: 0; background: ${COLOR_WASH}; opacity: 0.9; }
  .hands {
    position: absolute; left: 50%; bottom: 0; width: ${PHOTO_W}mm; height: auto; display: block;
    transform: translateX(-50%);
  }
  .content {
    position: absolute; left: 0; top: 0; width: 100%;
    display: flex; flex-direction: column; align-items: center; text-align: center;
    padding: ${contentPaddingTopMm}mm 12mm 0 12mm;
  }
  .logo { width: ${logoWidthMm}mm; height: ${logoWidthMm * logoAspect}mm; flex-shrink: 0; }
  .presents {
    font-weight: 400; font-size: 3.6mm; letter-spacing: 0.32em; text-transform: uppercase;
    color: ${COLOR_TEXT_GREEN_ON_DARK};
    /* content padding-top + presents/h1 margins are solved together so the
       logo sits exactly halfway between the inset's top edge and the
       title's top edge (see "logo position" console output), with
       "Presents" centered in the space left below the logo. */
    margin-top: ${presentsMarginTopMm}mm;
  }
  .h1-image {
    display: block; margin-top: ${h1MarginTopMm}mm; width: ${H1_IMG_W_MM}mm; height: ${H1_IMG_H_MM}mm;
  }
  .tagline {
    font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase;
    font-size: 13.5mm; line-height: 1.02; color: #ffffff; margin-top: 4mm; white-space: nowrap;
  }
  /* Tier A: the offer (what/who). Tight internal rhythm. */
  .cpe {
    font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase;
    font-size: 6mm; letter-spacing: 0.03em; color: #ffffff; margin-top: 5mm; white-space: nowrap;
  }
  .cpe .sep { color: ${COLOR_TEXT_ORANGE}; padding: 0 2mm; }
  .no-instrument {
    font-weight: 400; font-size: 4.8mm; line-height: 1.5; color: #ffffff; margin-top: 2.5mm; white-space: nowrap;
  }
  /* Tier B: the logistics (when/where). Set apart from Tier A by a much
     larger gap than either tier's internal spacing, so the two read as
     separate ideas. Date/time is the dominant element; address is a quiet
     caption beneath it. */
  .datetime {
    font-family: 'Anton', sans-serif; font-weight: 400; text-transform: uppercase;
    font-size: 8.5mm; letter-spacing: 0.01em; color: #ffffff; margin-top: 5mm;
  }
  .address {
    font-weight: 400; font-size: 5mm; color: ${COLOR_TEXT_GREEN_ON_DARK}; margin-top: 1.5mm; letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .qr-card {
    display: flex; flex-direction: column; align-items: center; gap: 1.4mm;
    margin-top: 3mm; background: #ffffff; border-radius: 3mm; padding: 3mm 8mm 3.5mm 8mm;
  }
  .qr-caption { font-weight: 400; font-size: 4mm; color: ${COLOR_TEXT_GREEN_ON_WHITE}; }
  .qr-card svg { display: block; width: 28mm; height: 28mm; }
  .qr-url { font-weight: 400; font-size: 4.6mm; color: ${COLOR_TEXT_GREEN_ON_WHITE}; }
  .badge {
    /* Sits in the gutter beside the QR box rather than in the crowded text
       zone above — horizontal offset centers it between the QR card's right
       edge and the inset's right edge; vertical offset centers it on the QR
       card. Both computed empirically, see "badge position" console output. */
    position: absolute; right: ${badgeRightMm}mm; bottom: ${badgeBottomMm}mm;
    width: 32mm; height: 32mm; border-radius: 50%;
    background: ${COLOR_BADGE_BG}; color: #ffffff;
    display: flex; align-items: center; justify-content: center; text-align: center;
    transform: rotate(-9deg);
    font-family: 'Anton', sans-serif; font-size: 7mm; line-height: 1.05; text-transform: uppercase;
    letter-spacing: 0.005em; padding: 1mm;
    box-shadow: 0 1.5mm 0 rgba(0,0,0,0.12);
  }
  </style></head><body>
  <div class="page">
    <div class="border"></div>
    <div class="inset">
      <div class="texture"></div>
      <div class="green-wash"></div>
      <img class="hands" src="${HANDS_DATA_URI}" />
      <div class="content">
        <svg class="logo" id="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>
        <div class="presents">Presents</div>
        <img class="h1-image" src="${H1_IMAGE_DATA_URI}" />
        <div class="tagline">Your Bandmates<br>Are Waiting!</div>
        <div class="cpe">Create <span class="sep">|</span> Play <span class="sep">|</span> Experiment</div>
        <div class="no-instrument">No instrument? No worries &mdash; we&rsquo;ve got plenty.</div>
        <div class="datetime">30 Sep&ndash;1 Oct: 9am&ndash;3pm</div>
        <div class="address">5 Woodville Lane, North Perth</div>
        <div class="qr-card">
          <div class="qr-caption">Scan for bookings</div>
          ${qrSvg}
          <div class="qr-url">goodnoiseproject.com.au</div>
        </div>
      </div>
      <div class="badge">Ages<br>14&ndash;17</div>
    </div>
  </div>
  </body></html>`;
}

// First pass with placeholder badge coordinates, purely to measure the
// QR card's position so the badge can be placed relative to it below.
const measurePage = await browser.newPage({
  deviceScaleFactor: 1,
  viewport: { width: Math.round(CANVAS_W * CSS_PX_PER_MM), height: Math.round(CANVAS_H * CSS_PX_PER_MM) },
});
await measurePage.setContent(renderHtml({ badgeBottomMm: 90, badgeRightMm: 12 }));
await measurePage.evaluate(async () => {
  await document.fonts.load('400 16px "Anton"');
  await document.fonts.load('400 16px "Fjalla One"');
  await document.fonts.ready;
});
await measurePage.waitForTimeout(200);
const badgePlacementRaw = await measurePage.evaluate(() => {
  const inset = document.querySelector('.inset').getBoundingClientRect();
  const qrCard = document.querySelector('.qr-card').getBoundingClientRect();
  const presents = document.querySelector('.presents').getBoundingClientRect();
  const h1Image = document.querySelector('.h1-image').getBoundingClientRect();
  const tagline = document.querySelector('.tagline').getBoundingClientRect();
  const cpe = document.querySelector('.cpe').getBoundingClientRect();
  return {
    insetTop: inset.top, insetRight: inset.right, insetBottom: inset.bottom,
    qrRight: qrCard.right, qrTop: qrCard.top, qrBottom: qrCard.bottom,
    presentsHeight: presents.height, h1ImageTop: h1Image.top,
    taglineBottom: tagline.bottom, cpeTop: cpe.top,
  };
});
await measurePage.close();
const BADGE_SIZE_MM = 32;
const insetBottomMm = badgePlacementRaw.insetBottom * CSS_PX_TO_MM;
const insetRightMm = badgePlacementRaw.insetRight * CSS_PX_TO_MM;
const qrRightMm = badgePlacementRaw.qrRight * CSS_PX_TO_MM;
// bottom (CSS, from inset's bottom edge) so the badge is vertically centered
// in the gap between "...Waiting!" and "CREATE | PLAY | EXPERIMENT"
const gapCenterMm = ((badgePlacementRaw.taglineBottom + badgePlacementRaw.cpeTop) / 2) * CSS_PX_TO_MM;
const badgeBottomMm = (insetBottomMm - (gapCenterMm + BADGE_SIZE_MM / 2)).toFixed(1);
// right (CSS, from inset's right edge) — unchanged: centered in the gutter
// between the QR card's right edge and the inset's right edge
const gutterMidMm = (qrRightMm + insetRightMm) / 2;
const badgeRightMm = (insetRightMm - gutterMidMm - BADGE_SIZE_MM / 2).toFixed(1);
console.log('badge position (mm):', { badgeBottomMm, badgeRightMm, gapCenterMm, insetBottomMm });

// Logo: slightly bigger, and re-centered so it sits exactly halfway between
// the inset's top edge and the title's top edge (the title's own position
// is left untouched — only the padding/margins above it are redistributed).
const LOGO_WIDTH_MM = 21; // up from 18mm
const logoHeightMm = LOGO_WIDTH_MM * logoAspect;
const h1TopMm = (badgePlacementRaw.h1ImageTop - badgePlacementRaw.insetTop) * CSS_PX_TO_MM;
const presentsHeightMm = badgePlacementRaw.presentsHeight * CSS_PX_TO_MM;
const contentPaddingTopMm = (h1TopMm - logoHeightMm) / 2;
const logoToH1GapMm = h1TopMm - contentPaddingTopMm - logoHeightMm;
const presentsMarginTopMm = (logoToH1GapMm - presentsHeightMm) / 2;
const h1MarginTopMm = presentsMarginTopMm;
console.log('logo position (mm):', { h1TopMm, logoHeightMm, contentPaddingTopMm, presentsMarginTopMm });

const html = renderHtml({
  badgeBottomMm, badgeRightMm,
  contentPaddingTopMm, logoWidthMm: LOGO_WIDTH_MM, presentsMarginTopMm, h1MarginTopMm,
});
writeFileSync(path.join(OUT_DIR, `flyer-v8-music-makers-spring${SUFFIX}.html`), html);

const page = await browser.newPage({
  deviceScaleFactor: 4,
  viewport: { width: Math.round(CANVAS_W * CSS_PX_PER_MM), height: Math.round(CANVAS_H * CSS_PX_PER_MM) },
});
await page.setContent(html);
await page.evaluate(async () => {
  await document.fonts.load('400 16px "Anton"');
  await document.fonts.load('400 16px "Fjalla One"');
  await document.fonts.ready;
});
await page.waitForTimeout(200);

const report = await page.evaluate(() => {
  const content = document.querySelector('.content');
  const rect = content.getBoundingClientRect();
  const tagline = document.querySelector('.tagline').getBoundingClientRect();
  return { contentBottom: rect.bottom, taglineWidth: tagline.width };
});
console.log('content/tagline (mm):', {
  contentBottomMm: (report.contentBottom * CSS_PX_TO_MM).toFixed(1),
  taglineWidthMm: (report.taglineWidth * CSS_PX_TO_MM).toFixed(1),
});

// hands.getBoundingClientRect().top is the *element* box top, which includes
// a large deliberately-transparent fade region above the visibly-opaque
// photo content (see textures/jam-hands-duotone-v8.png prep) — comparing
// against it is overly conservative and doesn't reflect what's actually on
// the page. Sample the real image pixels via canvas to find the first row
// with meaningful opacity instead.
const clearance = await page.evaluate(async () => {
  const img = document.querySelector('.hands');
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let firstOpaqueRow = null;
  for (let y = 0; y < canvas.height && firstOpaqueRow === null; y++) {
    for (let x = 0; x < canvas.width; x += 4) {
      if (data[(y * canvas.width + x) * 4 + 3] > 40) { firstOpaqueRow = y; break; }
    }
  }
  const handsRect = img.getBoundingClientRect();
  const visibleTopCssPx = handsRect.top + (firstOpaqueRow / canvas.height) * handsRect.height;
  const badge = document.querySelector('.badge').getBoundingClientRect();
  const qrCard = document.querySelector('.qr-card').getBoundingClientRect();
  return { visibleTopCssPx, badgeBottom: badge.bottom, qrCardBottom: qrCard.bottom };
});
console.log('clearance vs VISIBLE photo content (mm, positive = no overlap):', {
  visiblePhotoTopMm: (clearance.visibleTopCssPx * CSS_PX_TO_MM).toFixed(1),
  badgeVsVisiblePhotoMm: ((clearance.visibleTopCssPx - clearance.badgeBottom) * CSS_PX_TO_MM).toFixed(1),
  qrCardVsVisiblePhotoMm: ((clearance.visibleTopCssPx - clearance.qrCardBottom) * CSS_PX_TO_MM).toFixed(1),
});

await page.screenshot({ path: path.join(OUT_DIR, `flyer-v8-music-makers-spring${SUFFIX}-preview.png`) });

// Render at high-res (same 96dpi-reference viewport, deviceScaleFactor tuned
// close to 2480px wide), then hard-resize to the brief's exact 2480x3508 —
// the A4 aspect ratio already matches (210:297 == 2480:3508), so this is a
// lossless-ish final snap to the exact pixel spec, not a distorting resize.
const viewportW = Math.round(CANVAS_W * CSS_PX_PER_MM);
const viewportH = Math.round(CANVAS_H * CSS_PX_PER_MM);
const pngScaleFactor = 2480 / viewportW;
const pngPage = await browser.newPage({
  deviceScaleFactor: pngScaleFactor,
  viewport: { width: viewportW, height: viewportH },
});
await pngPage.setContent(html);
await pngPage.evaluate(async () => {
  await document.fonts.load('400 16px "Anton"');
  await document.fonts.load('400 16px "Fjalla One"');
  await document.fonts.ready;
});
await pngPage.waitForTimeout(200);
const rawPngPath = path.join(OUT_DIR, `flyer-v8-music-makers-spring${SUFFIX}-2480x3508-raw.png`);
await pngPage.screenshot({ path: rawPngPath });
await pngPage.close();
const finalPngPath = path.join(OUT_DIR, `flyer-v8-music-makers-spring${SUFFIX}-2480x3508.png`);
execFileSync('sips', ['-z', '3508', '2480', rawPngPath, '--out', finalPngPath], { stdio: 'inherit' });
execFileSync('sips', ['-s', 'dpiWidth', '300', '-s', 'dpiHeight', '300', finalPngPath], { stdio: 'inherit' });
rmSync(rawPngPath, { force: true });

const TMP_DIR = mkdtempSync(path.join(tmpdir(), 'good-noise-v8-'));
const rgbPdfPath = path.join(TMP_DIR, 'rgb.pdf');
await page.pdf({
  path: rgbPdfPath, width: `${CANVAS_W}mm`, height: `${CANVAS_H}mm`,
  printBackground: true, margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }, preferCSSPageSize: true,
});
await page.close();
await browser.close();

const finalPdfPath = path.join(OUT_DIR, `flyer-v8-music-makers-spring${SUFFIX}.pdf`);
execFileSync('gs', [
  '-o', finalPdfPath, '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
  '-dProcessColorModel=/DeviceCMYK', '-sColorConversionStrategy=CMYK', '-dColorConversionStrategyForImages=/CMYK',
  '-dOverrideICC', `-dDEVICEWIDTHPOINTS=${widthPt}`, `-dDEVICEHEIGHTPOINTS=${heightPt}`,
  '-dFIXEDMEDIA', '-dPDFFitPage', '-dEmbedAllFonts=true', '-dSubsetFonts=true', '-r300', '-dAutoRotatePages=/None',
  rgbPdfPath,
], { stdio: 'inherit' });
console.log('Print-ready CMYK PDF written to', finalPdfPath);
rmSync(TMP_DIR, { recursive: true, force: true });

console.log('\nDone. Outputs in', OUT_DIR);
