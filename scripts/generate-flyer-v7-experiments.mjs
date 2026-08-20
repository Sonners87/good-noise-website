// Three A4 flyer layout experiments, all sharing the exact copy/content of
// the approved reference design (print/flyer/final/good-noise-holiday-camp-flyer-v6e-girl-photo.pdf)
// but each testing a different treatment of the photo/visual element:
//   A — solid green background, photo confined to a small contained shape
//   B — no photo at all, color blocks + a line-art icon instead
//   C — photo confined to the top third, text lives on a panel below it
//
// Deliberately a SEPARATE script from generate-holiday-camp-flyer.mjs so
// there is no way running this can touch the reference file — it doesn't
// import from, or write into, that script's variant list at all.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import QRCode from 'qrcode';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'print', 'flyer', 'outputs');
mkdirSync(OUT_DIR, { recursive: true });

// --- Page geometry (mm). A4 trim + 3mm bleed, matching the reference. -----
const TRIM_W = 210;
const TRIM_H = 297;
const BLEED = 3;
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const BORDER = 6; // white frame thickness, matching the reference

// --- Brand (from src/index.css @theme) -------------------------------------
const COLOR_BRAND = '#1f3d2e';
const COLOR_SAGE = '#a7bfa4';
const COLOR_CREAM = '#f2ede4';
const COLOR_TERRACOTTA = '#e46a3a';

function fileToDataUri(absPath, mime) {
  return `data:${mime};base64,${readFileSync(absPath).toString('base64')}`;
}

const logoSvg = readFileSync(path.join(ROOT, 'src/assets/logo/good-noise-logo-forest.svg'), 'utf8');
const logoPathD = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const [, , LOGO_VB_W, LOGO_VB_H] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const logoAspect = LOGO_VB_H / LOGO_VB_W;

// Real photo asset — same one used in the reference PDF. Not a placeholder.
const PHOTO_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/guitar-girl.jpg'), 'image/jpeg');
const TEXTURE_CONCRETE_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/concrete-grey.jpg'), 'image/jpeg');
// Pre-recolored to sage as actual pixel data (via PIL), not a CSS mask —
// mask-image rendered fine in the on-screen screenshot check but silently
// fell back to an unmasked solid rectangle in Chromium's print-to-PDF
// export, which the screenshot check didn't catch since it's a different
// rendering path. A plain recolored PNG has no such print-path risk.
const GUITAR_ICON_SAGE_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/guitar-icon-sage.png'), 'image/png');

// "Jam"/band-feel background photos for the four v7-terracotta-energy spinoffs.
const JAM_INSTRUMENTS_SKY_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/jam-instruments-sky.jpg'), 'image/jpeg');
// Background-removed version (PIL, brightness-ramp alpha mask 135-195) — the
// flat grey sky is now transparent, leaving just the hands/instruments.
const JAM_INSTRUMENTS_CUTOUT_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/jam-instruments-cutout.png'), 'image/png');
const JAM_SILHOUETTE_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/jam-silhouette.jpg'), 'image/jpeg');
const JAM_GUITAR_AMP_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/jam-guitar-amp.jpg'), 'image/jpeg');
const JAM_HAND_FRETTING_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/jam-hand-fretting.jpg'), 'image/jpeg');

const QR_URL = 'https://goodnoiseproject.com.au/holiday-camps';
const qrSvg = await QRCode.toString(QR_URL, {
  type: 'svg', errorCorrectionLevel: 'Q', margin: 0,
  color: { dark: COLOR_BRAND, light: '#00000000' },
});

// Alternate QR for v7-jam-silhouette-clean, pointing at /spring-holidays —
// NOTE: this route does not exist on the live site yet (confirmed against
// App.tsx's route list earlier in this project); the real routes are
// /holiday-camps, /workshops, etc. Generated as instructed, but this QR
// will 404 until that route is actually added.
const QR_URL_SPRING_HOLIDAYS = 'https://goodnoiseproject.com.au/spring-holidays';
const qrSvgSpringHolidays = await QRCode.toString(QR_URL_SPRING_HOLIDAYS, {
  type: 'svg', errorCorrectionLevel: 'Q', margin: 0,
  color: { dark: COLOR_BRAND, light: '#00000000' },
});

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Fjalla+One&family=Anton&display=swap';

// --- Shared copy (identical across all three, and identical to the reference) —
// per instructions, none of this is reworded. -------------------------------
const COPY = {
  headline: 'Spring Holidays Music Makers Program',
  tagline: "Ever wondered what it's like playing in a band?",
  paragraphs: [
    "Come spend two days creating original music with other young people in a relaxed, supportive environment. Share ideas, try something new, and jam as a band.",
    "Whatever you play, and whether you're quiet, confident, or just giving it a go — there's a place for you. Don't own an instrument? No worries — we've got plenty.",
  ],
  age: 'Ages 14–17',
  agenote: "(Get in touch if you don't fit the age bracket.)",
  address: '5 Woodville Lane',
  location: 'NORTH PERTH',
  date: '30 Sep – 1 Oct',
  time: '9am–3pm',
  qrCaption: 'Scan for bookings',
  url: 'goodnoiseproject.com.au/holiday-camps',
};

// A simple hand-built line-art guitar icon for Version B (no photo). This is
// a rough first-draft placeholder, not a finished brand asset — flagged in
// the summary as something to swap for real icon artwork before shipping.
function guitarIcon({ color, size }) {
  return `<svg width="${size}mm" height="${size}mm" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47 10 L53 10 L53 45 L47 45 Z" stroke="${color}" stroke-width="2.5" fill="none"/>
    <line x1="49" y1="12" x2="49" y2="42" stroke="${color}" stroke-width="1"/>
    <line x1="51" y1="12" x2="51" y2="42" stroke="${color}" stroke-width="1"/>
    <ellipse cx="50" cy="68" rx="22" ry="26" stroke="${color}" stroke-width="2.5" fill="none"/>
    <circle cx="50" cy="66" r="8" stroke="${color}" stroke-width="2" fill="none"/>
    <line x1="47.5" y1="45" x2="45" y2="92" stroke="${color}" stroke-width="1"/>
    <line x1="52.5" y1="45" x2="55" y2="92" stroke="${color}" stroke-width="1"/>
  </svg>`;
}

// Simple soundwave line-art icon, used as a second accent in Version B.
function soundwaveIcon({ color, size }) {
  const bars = [40, 70, 100, 60, 85, 45, 65];
  const barWidth = 6;
  const gap = 4;
  const totalWidth = bars.length * barWidth + (bars.length - 1) * gap;
  const maxH = 100;
  const rects = bars.map((h, i) => {
    const x = i * (barWidth + gap);
    const y = (maxH - h) / 2;
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="${barWidth / 2}" fill="${color}"/>`;
  }).join('');
  return `<svg width="${size}mm" height="${size * 0.4}mm" viewBox="0 0 ${totalWidth} ${maxH}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

const FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${GOOGLE_FONTS_URL}" rel="stylesheet">`;

const PAGE_CSS_BASE = `
  @page { size: ${CANVAS_W}mm ${CANVAS_H}mm; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { width: ${CANVAS_W}mm; height: ${CANVAS_H}mm; font-family: 'Inter', sans-serif; }
  .page { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .border { position: absolute; inset: 0; background: #ffffff; }
`;

const QR_CARD_CSS = `
  .qr-card {
    background: ${COLOR_CREAM};
    border-radius: 5mm;
    padding: 5mm 7mm;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7mm;
  }
  .qr-card-qr-col { display: flex; flex-direction: column; align-items: center; gap: 2mm; }
  .qr-card-caption { font-weight: 700; font-size: 3.6mm; color: ${COLOR_BRAND}; }
  .qr-card-qr svg { display: block; width: 34mm; height: 34mm; }
  .qr-card-text { text-align: left; }
  .qr-card-address { font-weight: 700; font-size: 4mm; color: ${COLOR_BRAND}; }
  .qr-card-location { font-weight: 800; font-size: 4mm; letter-spacing: 0.04em; color: ${COLOR_BRAND}; margin-top: 0.5mm; }
  .qr-card-date, .qr-card-time { font-weight: 700; font-size: 4.6mm; color: ${COLOR_BRAND}; margin-top: 1mm; }
`;

function qrCardHtml(customQrSvg = null) {
  return `<div class="qr-card">
    <div class="qr-card-qr-col">
      <div class="qr-card-caption">${COPY.qrCaption}</div>
      <div class="qr-card-qr">${customQrSvg || qrSvg}</div>
    </div>
    <div class="qr-card-text">
      <div class="qr-card-address">${COPY.address}</div>
      <div class="qr-card-location">${COPY.location}</div>
      <div class="qr-card-date">${COPY.date}</div>
      <div class="qr-card-time">${COPY.time}</div>
    </div>
  </div>`;
}

// ============================================================================
// VERSION A — solid green background, photo in a small contained circle
// near the booking box (lower third), not behind any text.
// ============================================================================
function buildVersionA() {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  ${PAGE_CSS_BASE}
  .panel { position: absolute; inset: ${BORDER}mm; background: ${COLOR_BRAND}; }
  .content {
    position: absolute; left: ${BORDER + 11}mm; top: ${BORDER + 11}mm;
    width: ${CANVAS_W - (BORDER + 11) * 2}mm; height: ${CANVAS_H - (BORDER + 11) * 2}mm;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .logo { width: 30mm; height: ${30 * logoAspect}mm; }
  .headline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15.5mm; line-height: 1.05; letter-spacing: -0.005em; text-transform: uppercase; color: #ffffff; margin-top: 8mm; }
  .tagline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 6.6mm; line-height: 1.25; color: ${COLOR_TERRACOTTA}; margin-top: 6mm; max-width: 150mm; }
  .divider { width: 40mm; height: 1.6mm; border-radius: 999px; background: ${COLOR_SAGE}; margin-top: 6mm; }
  .blurb { display: flex; flex-direction: column; align-items: center; gap: 3mm; font-size: 4.4mm; font-weight: 600; line-height: 1.4; color: rgba(255,255,255,0.9); max-width: 130mm; margin-top: 6mm; }
  .age { font-weight: 800; font-size: 5.4mm; color: #ffffff; margin-top: 6mm; }
  .agenote { font-weight: 700; font-size: 4mm; color: #ffffff; margin-top: 2mm; }
  .spacer { flex: 1; min-height: 4mm; }
  .contained-photo {
    width: 52mm; height: 52mm; border-radius: 50%;
    background-image: url("${PHOTO_DATA_URI}"); background-size: cover; background-position: center 25%;
    border: 2.5mm solid ${COLOR_CREAM};
    margin-bottom: 8mm;
  }
  ${QR_CARD_CSS}
  .url { margin-top: 4mm; font-weight: 700; font-size: 4mm; color: #ffffff; }
  </style></head><body>
  <div class="page">
    <div class="border"></div>
    <div class="panel"></div>
    <div class="content">
      <svg class="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>
      <div class="headline">${COPY.headline}</div>
      <div class="tagline">${COPY.tagline}</div>
      <div class="divider"></div>
      <div class="blurb">${COPY.paragraphs.map((p) => `<p style="margin:0;">${p}</p>`).join('')}</div>
      <div class="age">${COPY.age}</div>
      <div class="agenote">${COPY.agenote}</div>
      <div class="spacer"></div>
      <div class="contained-photo"></div>
      ${qrCardHtml()}
      <div class="url">${COPY.url}</div>
    </div>
  </div>
  </body></html>`;
}

// ============================================================================
// VERSION B — no photo. Bold color blocks + line-art icons instead.
// ============================================================================
function buildVersionB() {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  ${PAGE_CSS_BASE}
  .panel { position: absolute; inset: ${BORDER}mm; background: ${COLOR_BRAND}; overflow: hidden; }
  .blob { position: absolute; top: -30mm; right: -30mm; width: 110mm; height: 110mm; border-radius: 50%; background: ${COLOR_TERRACOTTA}; opacity: 0.9; }
  .blob2 { position: absolute; bottom: -40mm; left: -40mm; width: 90mm; height: 90mm; border-radius: 50%; background: ${COLOR_SAGE}; opacity: 0.35; }
  .content {
    position: absolute; left: ${BORDER + 11}mm; top: ${BORDER + 11}mm;
    width: ${CANVAS_W - (BORDER + 11) * 2}mm; height: ${CANVAS_H - (BORDER + 11) * 2}mm;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .logo { width: 30mm; height: ${30 * logoAspect}mm; }
  .icon-row { display: flex; align-items: center; justify-content: center; gap: 6mm; margin-top: 6mm; }
  .headline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15.5mm; line-height: 1.05; letter-spacing: -0.005em; text-transform: uppercase; color: #ffffff; margin-top: 6mm; }
  .tagline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 6.6mm; line-height: 1.25; color: ${COLOR_TERRACOTTA}; margin-top: 6mm; max-width: 150mm; background: ${COLOR_CREAM}; padding: 2mm 6mm; border-radius: 999px; }
  .divider { width: 40mm; height: 1.6mm; border-radius: 999px; background: ${COLOR_SAGE}; margin-top: 6mm; }
  .blurb { display: flex; flex-direction: column; align-items: center; gap: 3mm; font-size: 4.4mm; font-weight: 600; line-height: 1.4; color: rgba(255,255,255,0.9); max-width: 130mm; margin-top: 6mm; }
  .age { font-weight: 800; font-size: 5.4mm; color: #ffffff; margin-top: 6mm; }
  .agenote { font-weight: 700; font-size: 4mm; color: #ffffff; margin-top: 2mm; }
  .spacer { flex: 1; min-height: 4mm; }
  ${QR_CARD_CSS}
  .url { margin-top: 4mm; font-weight: 700; font-size: 4mm; color: #ffffff; }
  </style></head><body>
  <div class="page">
    <div class="border"></div>
    <div class="panel">
      <div class="blob"></div>
      <div class="blob2"></div>
    </div>
    <div class="content">
      <svg class="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>
      <div class="icon-row">
        ${guitarIcon({ color: '#ffffff', size: 22 })}
        ${soundwaveIcon({ color: COLOR_TERRACOTTA, size: 26 })}
      </div>
      <div class="headline">${COPY.headline}</div>
      <div class="tagline">${COPY.tagline}</div>
      <div class="divider"></div>
      <div class="blurb">${COPY.paragraphs.map((p) => `<p style="margin:0;">${p}</p>`).join('')}</div>
      <div class="age">${COPY.age}</div>
      <div class="agenote">${COPY.agenote}</div>
      <div class="spacer"></div>
      ${qrCardHtml()}
      <div class="url">${COPY.url}</div>
    </div>
  </div>
  </body></html>`;
}

// ============================================================================
// VERSION C — photo confined to the top third, lightly tinted, no text on
// it at all (including the logo). Everything else sits on a panel below.
// ============================================================================
function buildVersionC() {
  const photoBandH = 95; // mm, "top third" of the 303mm canvas
  const panelTop = BORDER + photoBandH;
  const panelH = CANVAS_H - panelTop - BORDER;
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  ${PAGE_CSS_BASE}
  .photo-band {
    position: absolute; left: ${BORDER}mm; top: ${BORDER}mm; width: ${CANVAS_W - BORDER * 2}mm; height: ${photoBandH}mm;
    background-image: url("${PHOTO_DATA_URI}"); background-size: cover; background-position: center 20%;
  }
  .photo-tint { position: absolute; left: ${BORDER}mm; top: ${BORDER}mm; width: ${CANVAS_W - BORDER * 2}mm; height: ${photoBandH}mm; background: rgba(31,61,46,0.12); }
  .panel { position: absolute; left: ${BORDER}mm; top: ${panelTop}mm; width: ${CANVAS_W - BORDER * 2}mm; height: ${panelH}mm; background: ${COLOR_BRAND}; }
  .content {
    position: absolute; left: ${BORDER + 9}mm; top: ${panelTop + 8}mm;
    width: ${CANVAS_W - (BORDER + 9) * 2}mm; height: ${panelH - 16}mm;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .logo { width: 24mm; height: ${24 * logoAspect}mm; }
  .headline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 12.5mm; line-height: 1.04; letter-spacing: -0.005em; text-transform: uppercase; color: #ffffff; margin-top: 5mm; }
  .tagline { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 5.4mm; line-height: 1.2; color: ${COLOR_TERRACOTTA}; margin-top: 4mm; max-width: 150mm; }
  .divider { width: 34mm; height: 1.4mm; border-radius: 999px; background: ${COLOR_SAGE}; margin-top: 4mm; }
  .blurb { display: flex; flex-direction: column; align-items: center; gap: 2.2mm; font-size: 3.8mm; font-weight: 600; line-height: 1.35; color: rgba(255,255,255,0.9); max-width: 132mm; margin-top: 4mm; }
  .age { font-weight: 800; font-size: 4.6mm; color: #ffffff; margin-top: 4mm; }
  .agenote { font-weight: 700; font-size: 3.4mm; color: #ffffff; margin-top: 1.5mm; }
  .spacer { flex: 1; min-height: 3mm; }
  ${QR_CARD_CSS}
  .qr-card { padding: 3.5mm 6mm; gap: 6mm; }
  .qr-card-qr svg { width: 28mm; height: 28mm; }
  .url { margin-top: 3mm; font-weight: 700; font-size: 3.6mm; color: #ffffff; }
  </style></head><body>
  <div class="page">
    <div class="border"></div>
    <div class="photo-band"></div>
    <div class="photo-tint"></div>
    <div class="panel"></div>
    <div class="content">
      <svg class="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>
      <div class="headline">${COPY.headline}</div>
      <div class="tagline">${COPY.tagline}</div>
      <div class="divider"></div>
      <div class="blurb">${COPY.paragraphs.map((p) => `<p style="margin:0;">${p}</p>`).join('')}</div>
      <div class="age">${COPY.age}</div>
      <div class="agenote">${COPY.agenote}</div>
      <div class="spacer"></div>
      ${qrCardHtml()}
      <div class="url">${COPY.url}</div>
    </div>
  </div>
  </body></html>`;
}

// ============================================================================
// VERSION D — single requested revision. No photo at all: bold Forest-green
// base with one angled Terracotta color block behind the hero headline
// line. H1 moves to Fjalla One with per-line sizes ("MUSIC MAKERS" much
// larger than "SPRING HOLIDAYS"/"PROGRAM"). New tagline + tightened
// single-sentence body copy. "Ages 14–17" becomes a Terracotta pill badge.
// The cream QR/detail box is untouched — reuses qrCardHtml()/QR_CARD_CSS
// verbatim, same as every other version in this file.
// ============================================================================
const COPY_D = {
  ...COPY,
  tagline: "Wondered what it's like to play in a band?",
  // "whatever you're experience" in the request was a typo for "your" —
  // corrected here since the original doesn't parse grammatically.
  body: "Come spend two days creating music with other young musos. Whatever you play, whatever your experience, there's a place for you. No instrument? No worries — we've got plenty.",
};

function buildVersionD(bg = {}, opts = {}) {
  const {
    dataUri = TEXTURE_CONCRETE_DATA_URI,
    position = 'center',
    size = 'cover',
    grayscale = false,
    overlayOpacity = 0.78,
    flipVertical = false,
  } = bg;
  const {
    taglineLines = ["Wondered what it's like", 'to play in a band?'],
    showAgenote = true,
    qrCardBackground = COLOR_TERRACOTTA,
    bodyParagraphs = null, // null = single paragraph, COPY_D.body verbatim (back-compat)
    blurbMaxWidth = '132mm',
    nowrapLastParagraph = false,
    qrSvgOverride = null,
    urlText = null,
    // Only .h1-line (heading "Music Makers" + subheading "Spring Holidays
    // Music Program") — .presents and .tagline keep Fjalla One regardless.
    headingFontFamily = "'Fjalla One', sans-serif",
    spacerMidMinHeight = '5mm',
    spacerMinHeight = '5mm',
    // Page-relative mm (top of .page = 0) to vertically center the .url
    // text on, taking it out of flex flow entirely. null = default flow
    // position (flex .spacer + margin-top, as before).
    urlAbsoluteTopMm = null,
  } = opts;
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINKS}<style>
  ${PAGE_CSS_BASE}
  .bg-image {
    position: absolute; inset: ${BORDER}mm;
    /* Solid fallback so transparent pixels (e.g. a removed-sky cutout) show
       brand green instead of the white border layer underneath. */
    background-color: ${COLOR_BRAND};
    background-image: url("${dataUri}"); background-size: ${size}; background-position: ${position};
    background-repeat: no-repeat;
    filter: ${grayscale ? 'grayscale(100%)' : 'none'};
    transform: ${flipVertical ? 'scaleY(-1)' : 'none'};
  }
  .bg-overlay { position: absolute; inset: ${BORDER}mm; background: rgba(31,61,46,${overlayOpacity}); }
  .content {
    position: absolute; left: ${BORDER + 11}mm; top: ${BORDER + 11}mm;
    width: ${CANVAS_W - (BORDER + 11) * 2}mm; height: ${CANVAS_H - (BORDER + 11) * 2}mm;
    display: flex; flex-direction: column; align-items: center; text-align: center;
  }
  .logo { width: 40mm; height: ${40 * logoAspect}mm; flex-shrink: 0; }
  .presents { font-family: 'Fjalla One', sans-serif; font-weight: 400; font-size: 4.6mm; letter-spacing: 0.35em; text-transform: uppercase; color: ${COLOR_SAGE}; margin-top: 6mm; }
  .h1-line { font-family: ${headingFontFamily}; font-weight: 400; text-transform: uppercase; color: #ffffff; }
  .h1-first { margin-top: 12mm; }
  .h1-small { font-size: 10mm; line-height: 1.05; margin-top: 5mm; color: ${COLOR_TERRACOTTA}; }
  .h1-hero {
    font-size: 24.2mm; line-height: 1.02; font-weight: 400;
    letter-spacing: 0.09em; color: ${COLOR_TERRACOTTA}; margin-bottom: 2mm;
    display: inline-block; transform: scaleY(1.35); transform-origin: center;
  }
  .tagline { font-family: 'Fjalla One', sans-serif; font-weight: 400; font-size: 9.5mm; line-height: 1.15; text-transform: none; color: #ffffff; margin-top: 0; max-width: 150mm; }
  .blurb {
    display: flex; flex-direction: column; align-items: center; gap: 3mm;
    font-size: 5mm; font-weight: 600; line-height: 1.45; color: rgba(255,255,255,0.92);
    max-width: ${blurbMaxWidth}; margin-top: 4mm;
  }
  .blurb p { margin: 0; }
  .blurb p.nowrap { white-space: nowrap; }
  .age-badge { display: inline-block; background: ${COLOR_TERRACOTTA}; color: #ffffff; font-weight: 800; font-size: 5.6mm; padding: 3mm 10mm; border-radius: 999px; margin-top: 6mm; }
  .agenote { font-weight: 700; font-size: 4.2mm; color: #ffffff; margin-top: 3mm; }
  .spacer { flex: 1; min-height: ${spacerMinHeight}; }
  .spacer-mid { flex: 1; min-height: ${spacerMidMinHeight}; }
  ${QR_CARD_CSS}
  .qr-card { background: ${qrCardBackground}; margin-top: 0; padding: 5mm 10mm; gap: 10mm; }
  .qr-card-qr {
    background: #ffffff; display: inline-block; line-height: 0;
    padding: 2.5mm; border-radius: 2mm;
  }
  .qr-card-qr svg { width: 46mm; height: 46mm; }
  .qr-card-caption { font-size: 5mm; color: #ffffff; }
  .qr-card-address, .qr-card-location, .qr-card-date, .qr-card-time { font-size: 6.5mm; color: #ffffff; }
  .url { margin-top: 3mm; font-weight: 700; font-size: 4.4mm; color: #ffffff; }
  </style></head><body>
  <div class="page">
    <div class="border"></div>
    <div class="bg-image"></div>
    <div class="bg-overlay"></div>
    <div class="content">
      <svg class="logo" id="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>
      <div class="presents">Presents</div>
      <div class="h1-line h1-hero h1-first">Music Makers</div>
      <div class="h1-line h1-small">Spring Holidays Music Program</div>
      <div class="spacer-mid"></div>
      <div class="tagline">${taglineLines.join('<br>')}</div>
      <div class="blurb">${
        bodyParagraphs
          ? bodyParagraphs.map((p, i) => `<p${nowrapLastParagraph && i === bodyParagraphs.length - 1 ? ' class="nowrap"' : ''}>${p}</p>`).join('')
          : COPY_D.body
      }</div>
      <div class="age-badge">${COPY_D.age}</div>
      ${showAgenote ? `<div class="agenote">${COPY_D.agenote}</div>` : ''}
      <div class="spacer"></div>
      ${qrCardHtml(qrSvgOverride)}
      <div class="url"${urlAbsoluteTopMm != null ? ` style="position:absolute; left:0; right:0; margin-top:0; top:${urlAbsoluteTopMm - (BORDER + 11)}mm; transform:translateY(-50%);"` : ''}>${urlText || COPY_D.url}</div>
    </div>
  </div>
  </body></html>`;
}

// ============================================================================
// Render pipeline — same render/verify/CMYK approach as the main script.
// ============================================================================
const VARIANTS = [
  { key: 'v7-solid-with-contained-photo', build: buildVersionA },
  { key: 'v7-no-photo-graphic', build: buildVersionB },
  { key: 'v7-top-third-photo', build: buildVersionC },
  { key: 'v7-terracotta-energy', build: () => buildVersionD() },
  // Four background-photo spinoffs of v7-terracotta-energy — same copy/layout,
  // untouched; only the background differs. Each photo is landscape (~1.5
  // aspect) against the page's portrait ~0.71 aspect, so `cover` always crops
  // left/right and keeps full height — position tuned per-photo below to keep
  // the instrument(s) in frame. All get a heavier overlay than the concrete
  // texture did (0.78) since real photos have brighter/busier passages that
  // would otherwise fight with the text.
  {
    key: 'v7-jam-instruments-sky',
    build: () => buildVersionD({
      dataUri: JAM_INSTRUMENTS_CUTOUT_DATA_URI, grayscale: true,
      // Zoomed out further, 1.25x → 1.08x (cover-scale 291mm height × 1.5
      // aspect = 436.5mm width, × 1.08) so a fifth instrument comes into view.
      // Position-x recalculated for this new zoom (the formula's offset term
      // depends on rendered image width, so it shifts slightly with zoom) —
      // still solving for the cymbal's measured 51.2%-of-source centroid to
      // land at the container's horizontal center, behind the logo.
      // Flipped vertically so the instruments (anchored to the image's
      // bottom edge, pre-flip) land at the top of the page, coming down.
      position: '52.1% 100%', size: '471.42mm 314.28mm',
      // Opacity dropped substantially (0.85 → 0.6) — the previous version
      // made the (already-dark) instrument silhouettes nearly indistinguishable
      // from the dark green overlay itself. Lower opacity lets more of their
      // tonal detail read through while still tinting the whole thing green.
      overlayOpacity: 0.6,
      flipVertical: true,
    }),
  },
  {
    key: 'v7-jam-instruments-sky-bottom',
    // Same as v7-jam-instruments-sky in every respect (zoom, cymbal-centering
    // position-x, opacity) — the only difference is flipVertical is off, so
    // the image keeps its natural orientation: hands anchored to the bottom
    // of the page, instrument necks pointing up into the page, instead of
    // hanging down from the top.
    build: () => buildVersionD({
      dataUri: JAM_INSTRUMENTS_CUTOUT_DATA_URI, grayscale: true,
      position: '52.1% 100%', size: '471.42mm 314.28mm',
      overlayOpacity: 0.6,
      flipVertical: false,
    }),
  },
  {
    key: 'v7-jam-silhouette',
    build: () => buildVersionD({
      dataUri: JAM_SILHOUETTE_DATA_URI, grayscale: true,
      // Guitar neck reaches up-right of the silhouette; bias right so cover's
      // left/right crop doesn't clip it. Overlay pushed much darker (0.8→0.93)
      // for body-copy legibility — the silhouette itself is already
      // near-black so it stays visible; it's the bright teal background that
      // needed taming.
      position: '65% center', overlayOpacity: 0.93,
    }),
  },
  {
    key: 'v7-jam-silhouette-clean',
    // New spinoff of v7-jam-silhouette (that one's untouched) — same
    // background/position/overlay, three copy/layout changes only:
    // no orange card behind the QR block, no agenote line, and "Ever"
    // added to the top of the tagline (pushing "like" onto line two).
    build: () => buildVersionD(
      {
        dataUri: JAM_SILHOUETTE_DATA_URI, grayscale: true,
        position: '65% center', overlayOpacity: 0.93,
      },
      {
        taglineLines: ["Ever wondered what it's", 'like to play in a band?'],
        showAgenote: false,
        qrCardBackground: 'transparent',
        // Capped to the rendered width of the tagline's own second line
        // ("like to play in a band?" at Fjalla One 400/9.5mm measures
        // 79.74mm — measured via a headless render, not guessed), so the
        // body copy never exceeds the tagline's own footprint. This is
        // narrower than the old 132mm/118mm values, so the last paragraph
        // can no longer stay on one line — nowrapLastParagraph dropped
        // to let it wrap naturally within the new width.
        blurbMaxWidth: '79.7mm',
        bodyParagraphs: [
          "Come spend two days creating music with other young musos. Whatever you play, whatever your experience, there's a place for you.",
          "No instrument? No worries &mdash; we've got plenty.",
        ],
        urlText: 'goodnoiseproject.com.au',
        // Group (tagline+blurb+age-badge) shifted down 2.5mm so the gap
        // above it (h1-small -> tagline, pure spacer-mid) equals the gap
        // below it (age-badge -> "Scan for bookings", spacer + qr-card's
        // own 5mm padding-top). Split 7.5/2.5 so both resolve to 7.5mm —
        // measured via headless render.
        spacerMidMinHeight: '7.5mm',
        spacerMinHeight: '2.5mm',
        // Vertically centered on the midpoint between the QR code's
        // bottom edge (281.78mm) and the top of the white border
        // (CANVAS_H - BORDER = 297mm) -> 289.39mm, page-relative.
        // Measured via headless render, not guessed.
        urlAbsoluteTopMm: 289.39,
      },
    ),
  },
  {
    key: 'v7-jam-silhouette-clean-anton',
    // Identical to v7-jam-silhouette-clean in every respect except the
    // heading font: "Music Makers" and "Spring Holidays Music Program"
    // switch from Fjalla One to Anton. Letter-spacing is left exactly as
    // it already was (0.09em on the hero line, none on the subheading) —
    // only the font-family changes, per instructions.
    build: () => buildVersionD(
      {
        dataUri: JAM_SILHOUETTE_DATA_URI, grayscale: true,
        position: '65% center', overlayOpacity: 0.93,
      },
      {
        taglineLines: ["Ever wondered what it's", 'like to play in a band?'],
        showAgenote: false,
        qrCardBackground: 'transparent',
        blurbMaxWidth: '79.7mm',
        bodyParagraphs: [
          "Come spend two days creating music with other young musos. Whatever you play, whatever your experience, there's a place for you.",
          "No instrument? No worries &mdash; we've got plenty.",
        ],
        urlText: 'goodnoiseproject.com.au',
        spacerMidMinHeight: '7.5mm',
        spacerMinHeight: '2.5mm',
        urlAbsoluteTopMm: 289.39,
        headingFontFamily: "'Anton', sans-serif",
      },
    ),
  },
  {
    key: 'v7-jam-guitar-amp',
    build: () => buildVersionD({
      dataUri: JAM_GUITAR_AMP_DATA_URI, grayscale: true,
      // Guitar runs diagonally through the frame center — already a dark
      // photo, so a lighter overlay still keeps text legible.
      position: 'center', overlayOpacity: 0.72,
    }),
  },
  {
    key: 'v7-jam-hand-fretting',
    build: () => buildVersionD({
      dataUri: JAM_HAND_FRETTING_DATA_URI, grayscale: true,
      // Abstract close-up crop; the bright white pickguard needs the
      // heaviest overlay of the four to not fight with the text.
      position: 'center 40%', overlayOpacity: 0.84,
    }),
  },
];

const PX_PER_MM = 96 / 25.4;
const PT_PER_MM = 72 / 25.4;
const widthPt = (CANVAS_W * PT_PER_MM).toFixed(6);
const heightPt = (CANVAS_H * PT_PER_MM).toFixed(6);

const browser = await chromium.launch();
const keyFilter = process.argv[2];
const toRun = keyFilter ? VARIANTS.filter((v) => keyFilter.split(',').includes(v.key)) : VARIANTS;

for (const variant of toRun) {
  console.log(`\n=== ${variant.key} ===`);
  const html = variant.build();
  writeFileSync(path.join(OUT_DIR, `flyer-${variant.key}.html`), html);

  const page = await browser.newPage({
    deviceScaleFactor: 4,
    viewport: { width: Math.round(CANVAS_W * PX_PER_MM), height: Math.round(CANVAS_H * PX_PER_MM) },
  });
  await page.setContent(html);
  await page.evaluate(async () => {
    await document.fonts.load('800 16px "Outfit"');
    await document.fonts.load('700 16px "Inter"');
    await document.fonts.load('600 16px "Inter"');
    await document.fonts.load('400 16px "Fjalla One"');
    await document.fonts.ready;
  });
  await page.waitForTimeout(200);

  const report = await page.evaluate(() => {
    const content = document.querySelector('.content');
    const rect = content.getBoundingClientRect();
    return { overflowPx: content.scrollHeight - rect.height, scrollHeight: content.scrollHeight, rectHeight: rect.height };
  });
  console.log(`[${variant.key}] content overflow check (px, scaled):`, report);
  if (report.overflowPx > 4) {
    console.warn(`WARNING [${variant.key}]: content may overflow its box by ~${(report.overflowPx / PX_PER_MM).toFixed(1)}mm — check the render.`);
  }

  // Verify the logo's ACTUAL rendered size, not just the CSS value — this is
  // the check that caught the flex-shrink squashing bug in the other script.
  // .logo has flex-shrink:0 here specifically so it can no longer silently
  // absorb overflow the way it did before.
  const logoEl = await page.$('#logo');
  if (logoEl) {
    const logoBox = await page.evaluate(() => {
      const el = document.getElementById('logo');
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { renderedWidthPx: r.width, renderedHeightPx: r.height, cssWidth: cs.width, cssHeight: cs.height };
    });
    console.log(`[${variant.key}] Logo actual rendered box vs CSS:`, logoBox);
    const cssWmm = parseFloat(logoBox.cssWidth) / PX_PER_MM;
    const renderedWmm = logoBox.renderedWidthPx / PX_PER_MM;
    if (Math.abs(cssWmm - renderedWmm) > 1) {
      console.warn(`WARNING [${variant.key}]: logo CSS width (${cssWmm.toFixed(1)}mm) doesn't match its actual rendered width (${renderedWmm.toFixed(1)}mm) — something is overriding or shrinking it.`);
    }
  }

  await page.screenshot({ path: path.join(OUT_DIR, `flyer-${variant.key}-preview.png`) });

  const TMP_DIR = mkdtempSync(path.join(tmpdir(), `good-noise-v7-${variant.key}-`));
  const rgbPdfPath = path.join(TMP_DIR, 'rgb.pdf');
  await page.pdf({
    path: rgbPdfPath, width: `${CANVAS_W}mm`, height: `${CANVAS_H}mm`,
    printBackground: true, margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }, preferCSSPageSize: true,
  });
  await page.close();

  const finalPdfPath = path.join(OUT_DIR, `flyer-${variant.key}.pdf`);
  execFileSync('gs', [
    '-o', finalPdfPath, '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
    '-dProcessColorModel=/DeviceCMYK', '-sColorConversionStrategy=CMYK', '-dColorConversionStrategyForImages=/CMYK',
    '-dOverrideICC', `-dDEVICEWIDTHPOINTS=${widthPt}`, `-dDEVICEHEIGHTPOINTS=${heightPt}`,
    '-dFIXEDMEDIA', '-dPDFFitPage', '-dEmbedAllFonts=true', '-dSubsetFonts=true', '-r300', '-dAutoRotatePages=/None',
    rgbPdfPath,
  ], { stdio: 'inherit' });
  console.log(`[${variant.key}] Print-ready CMYK PDF written to`, finalPdfPath);
  rmSync(TMP_DIR, { recursive: true, force: true });
}

await browser.close();
console.log('\nAll v7 experiment variants generated in', OUT_DIR);
