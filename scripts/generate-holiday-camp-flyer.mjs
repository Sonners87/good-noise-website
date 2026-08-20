// A4 flyer for the September/October 2026 songwriting camps. Follows the
// same render → verify → CMYK pipeline as generate-business-card.mjs
// (Playwright for layout/typography, Ghostscript for the print-ready
// CMYK PDF), but builds the page as HTML/CSS rather than hand-placed SVG
// text, since this layout is mostly wrapping paragraphs rather than a
// few fixed short lines.
//
// Generates v1 (the original Baloo 2 heading, kept as the baseline) plus
// three heading-font alternatives requested after v1 felt too soft/kiddie
// for the brand. Layout, copy, colors, QR and everything else stay
// identical across all four — only the headline (and, since Baloo 2 is
// the thing being replaced, the tagline that leaned on it) changes, so
// they're a clean side-by-side comparison of the heading font alone.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import QRCode from 'qrcode';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'print', 'flyer');
mkdirSync(OUT_DIR, { recursive: true });

// --- Page geometry (mm). A4 trim + 3mm bleed on all sides. ----------------
const TRIM_W = 210;
const TRIM_H = 297;
const BLEED = 3;
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const SAFE = 14; // inside trim
const INSET = BLEED + SAFE; // from canvas edge to content edge

// --- Brand (from src/index.css @theme — do not invent new values here) ----
const COLOR_BRAND = '#1f3d2e';
const COLOR_SAGE = '#a7bfa4';
const COLOR_CREAM = '#f2ede4';
const COLOR_TERRACOTTA = '#e46a3a';

// --- Logo: reuse the forest SVG's path data, recoloured to cream for use
// on the dark background (there's no pre-built light-colored SVG, only a
// raster PNG, and a vector recolor prints cleaner at any size). ------------
const logoSvg = readFileSync(path.join(ROOT, 'src/assets/logo/good-noise-logo-forest.svg'), 'utf8');
const logoPathD = logoSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const [, , LOGO_VB_W, LOGO_VB_H] = logoSvg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const logoAspect = LOGO_VB_H / LOGO_VB_W;

// --- QR code: fresh code for this flyer's specific landing URL (the
// existing public/qr-code asset points at the site root, not this page).
// Rendered dark-on-transparent for a light backing plate — safer to scan
// off a home printer than light-on-dark, which is the priority for a
// flyer meant for mass, uncontrolled reproduction. -------------------------
const QR_URL = 'https://goodnoiseproject.com.au/holiday-camps';
const qrSvg = await QRCode.toString(QR_URL, {
  type: 'svg',
  errorCorrectionLevel: 'Q',
  margin: 0,
  color: { dark: COLOR_BRAND, light: '#00000000' },
});

// --- Background-photo variants (v6a-c): embedded as data URIs rather than
// file:// references, since Playwright loads the HTML via setContent() with
// no base URL for relative paths to resolve against — same reasoning as
// inlining the logo/QR SVGs above, just for raster sources. ----------------
function fileToDataUri(absPath, mime) {
  return `data:${mime};base64,${readFileSync(absPath).toString('base64')}`;
}
const TEXTURE_MESH_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/mesh-black.webp'), 'image/webp');
const TEXTURE_CONCRETE_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/concrete-grey.jpg'), 'image/jpeg');
const PHOTO_SUNSET_FRIENDS_DATA_URI = fileToDataUri(path.join(ROOT, 'src/assets/images/hero-sunset-friends.webp'), 'image/webp');
const PHOTO_LAUGHING_GIRL_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/laughing-girl.jpg'), 'image/jpeg');
const PHOTO_GUITAR_GIRL_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/guitar-girl.jpg'), 'image/jpeg');
const PHOTO_FRIENDS_CLIFF_DATA_URI = fileToDataUri(path.join(ROOT, 'print/flyer/textures/friends-cliff.jpg'), 'image/jpeg');

// --- Heading-font variants --------------------------------------------------
// v1: the original. Kept as-is (Baloo 2 headline + tagline) as the baseline
// to compare the new options against.
// v2-v4: researched against youth-music-org branding (The Push's custom
// "Headline Act" typeface — bold/loud/confident, School of Rock's hand-drawn
// poster energy) rather than picked arbitrarily. Baloo 2's rounded "bubble
// lettering" reads as a kids'-app font, which is exactly what didn't land —
// so for v2-v4 the tagline also moves off Baloo 2 onto Inter, so the
// replacement is a clean single-display-voice redesign, not a patch.
const VARIANTS = [
  {
    key: 'v1-baloo',
    file: 'good-noise-holiday-camp-flyer.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer.html',
    note: 'Original — Baloo 2 (kept as baseline)',
    headline: { family: "'Baloo 2', sans-serif", weight: 800, size: '15.5mm', lineHeight: 1.04, letterSpacing: 'normal', loadSpec: '800 16px "Baloo 2"' },
    tagline: { family: "'Baloo 2', sans-serif", weight: 700, size: '8.6mm', lineHeight: 1.18, letterSpacing: 'normal', loadSpec: '700 16px "Baloo 2"' },
  },
  {
    key: 'v2-anton',
    file: 'good-noise-holiday-camp-flyer-v2-anton.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v2-anton-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v2-anton.html',
    note: 'Anton — bold condensed gig-poster energy (The Push / show-flyer direction)',
    headline: { family: "'Anton', sans-serif", weight: 400, size: '14.5mm', lineHeight: 1.02, letterSpacing: '0.01em', loadSpec: '400 16px "Anton"' },
    tagline: { family: "'Inter', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Inter"' },
  },
  {
    key: 'v3-bungee',
    file: 'good-noise-holiday-camp-flyer-v3-bungee.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v3-bungee-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v3-bungee.html',
    note: 'Bungee — chunky geometric display, playful but grown-up (street/pop energy)',
    headline: { family: "'Bungee', sans-serif", weight: 400, size: '11.5mm', lineHeight: 1.3, letterSpacing: 'normal', loadSpec: '400 16px "Bungee"' },
    tagline: { family: "'Inter', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Inter"' },
  },
  {
    key: 'v4-marker',
    file: 'good-noise-holiday-camp-flyer-v4-marker.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v4-marker-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v4-marker.html',
    note: 'Permanent Marker — hand-drawn DIY energy (School of Rock / zero2hero grassroots gig-poster direction)',
    headline: { family: "'Permanent Marker', cursive", weight: 400, size: '12.5mm', lineHeight: 1.3, letterSpacing: 'normal', loadSpec: '400 16px "Permanent Marker"' },
    tagline: { family: "'Inter', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Inter"' },
  },
  {
    key: 'v5-lexend',
    file: 'good-noise-holiday-camp-flyer-v5-lexend.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v5-lexend-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v5-lexend.html',
    note: 'Lexend Black — confident geometric grotesk, contemporary/clean rather than poster-loud or hand-drawn',
    headline: { family: "'Lexend', sans-serif", weight: 900, size: '18mm', lineHeight: 1.04, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '900 16px "Lexend"' },
    tagline: { family: "'Inter', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Inter"' },
    // Uppercase at this size wraps to 4 lines instead of 2, so the shared
    // rhythm needs tightening to still fit the safe area — see DEFAULT_SPACING.
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
  },
  {
    key: 'v6-outfit',
    file: 'good-noise-holiday-camp-flyer-v6-outfit.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6-outfit-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6-outfit.html',
    note: 'Outfit ExtraBold headline + Inter body — safe/neutral pairing, matches the rest of the site\'s body copy',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Inter',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
  },
  {
    key: 'v6a-mesh',
    file: 'good-noise-holiday-camp-flyer-v6a-mesh.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6a-mesh-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6a-mesh.html',
    note: 'v6 background swap — black woven-mesh texture, forest-green tint over it',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Inter',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
    background: { type: 'image', dataUri: TEXTURE_MESH_DATA_URI, position: 'center', overlayColor: 'rgba(31,61,46,0.82)' },
  },
  {
    key: 'v6b-concrete',
    file: 'good-noise-holiday-camp-flyer-v6b-concrete.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6b-concrete-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6b-concrete.html',
    note: 'v6 background swap — grey scratched-concrete texture, forest-green tint over it',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Inter',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
    background: { type: 'image', dataUri: TEXTURE_CONCRETE_DATA_URI, position: 'center', overlayColor: 'rgba(31,61,46,0.78)' },
  },
  {
    key: 'v6c-photo',
    file: 'good-noise-holiday-camp-flyer-v6c-photo.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6c-photo-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6c-photo.html',
    note: 'v6 background swap — sunset-friends photo full-bleed, forest-green scrim, girl positioned right-of-frame mid-page',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Inter',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
    background: { type: 'image', dataUri: PHOTO_SUNSET_FRIENDS_DATA_URI, position: '78% 40%', overlayColor: 'rgba(31,61,46,0.62)' },
  },
  {
    key: 'v6a-mesh-border',
    file: 'good-noise-holiday-camp-flyer-v6a-mesh-border.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6a-mesh-border-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6a-mesh-border.html',
    note: 'v6a + thick white border, matching the mat-style frame on the Settlers Tavern reference poster',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Inter',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
    background: { type: 'image', dataUri: TEXTURE_MESH_DATA_URI, position: 'center', overlayColor: 'rgba(31,61,46,0.82)' },
    border: { thickness: 12, color: '#ffffff' },
  },
  {
    key: 'v6b-concrete-border',
    file: 'good-noise-holiday-camp-flyer-v6b-concrete-border.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6b-concrete-border-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6b-concrete-border.html',
    note: 'v6b + thin white border; H2 (tagline) now matches H1\'s font (Outfit) instead of Inter — this is the twin of v6d, font only differs',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    tagline: { family: "'Outfit', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Outfit"' },
    taglineLines: ['One song.', 'Two days.', 'A tonne of new mates.'],
    bodyFamilyName: 'Inter',
    spacing: {
      headlineMarginTop: 8, taglineMarginTop: 4, dividerMarginTop: 4, blurbMarginTop: 4, infoMarginTop: 5, qrMarginTop: 5,
      qrSize: 40, qrPadding: 5, qrCardTextGap: 0, qrCardPaddingX: 0,
      qrCardCaptionSize: 4.2, qrCardLocationSize: 5,
      qrCardDateSize: 5.6, qrCardDateWeight: 700, qrCardDateMarginTop: 3,
      qrCardTimeSize: 5.6, qrCardTimeWeight: 700, qrCardTimeColor: COLOR_BRAND,
      infoProgramSize: 6.5, agenoteWeight: 800, agenoteSize: 5, instrumentSize: 5,
      logoWidth: 40, logoMarginTop: 4, blurbWeight: 700,
      infoProgramColor: '#ffffff', infoAgenoteColor: '#ffffff', infoInstrumentColor: COLOR_TERRACOTTA,
    },
    background: { type: 'image', dataUri: TEXTURE_CONCRETE_DATA_URI, position: 'center', overlayColor: 'rgba(31,61,46,0.78)' },
    border: { thickness: 6, color: '#ffffff' },
    copy: {
      address: '5 Woodville Lane',
      agenote: "(Get in touch if you don't fit the age bracket.)",
      instrumentLines: ["Don't own an instrument?", "No worries &mdash; we've got plenty."],
    },
    qrCard: true,
    qrCardMatchHeadlineWidth: true,
    qrCardMatchLineIndex: 1,
    qrCardJustify: 'space-evenly',
    logoMatchHeadlineHeight: true,
  },
  {
    key: 'v6e-girl-photo',
    file: 'final/good-noise-holiday-camp-flyer-v6e-girl-photo.pdf',
    previewFile: 'final/good-noise-holiday-camp-flyer-v6e-girl-photo-preview.png',
    htmlFile: 'final/good-noise-holiday-camp-flyer-v6e-girl-photo.html',
    note: 'Chosen final design — guitar-girl photo background, "Music Makers" heading, single-question tagline, two-paragraph body copy',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    tagline: { family: "'Outfit', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Outfit"' },
    taglineLines: ["Ever wondered what it's like playing in a band?"],
    bodyFamilyName: 'Inter',
    spacing: {
      headlineMarginTop: 8, taglineMarginTop: 3, dividerMarginTop: 3, blurbMarginTop: 3, infoMarginTop: 4, qrMarginTop: 4,
      qrSize: 40, qrPadding: 5, qrCardTextGap: 0, qrCardPaddingX: 0,
      qrCardCaptionSize: 4.2, qrCardLocationSize: 5,
      qrCardDateSize: 5.6, qrCardDateWeight: 700, qrCardDateMarginTop: 3,
      qrCardTimeSize: 5.6, qrCardTimeWeight: 700, qrCardTimeColor: COLOR_BRAND,
      infoProgramSize: 6.5, agenoteWeight: 800, agenoteSize: 5, instrumentSize: 5,
      logoWidth: 40, logoMarginTop: 4, blurbWeight: 700,
      infoProgramColor: '#ffffff', infoAgenoteColor: '#ffffff', infoInstrumentColor: COLOR_TERRACOTTA,
    },
    background: {
      // This photo's aspect ratio (0.667) is close to the page's (0.713), so
      // plain cover only crops ~7% off the top/bottom and 0% off the sides —
      // no need to zoom like the previous photo did. Position biased toward
      // the top so her face stays clear of that small crop; the guitar sits
      // further down and has plenty of margin either way.
      type: 'image', dataUri: PHOTO_GUITAR_GIRL_DATA_URI, grayscale: true,
      size: 'cover', position: 'center 20%', overlayColor: 'rgba(31,61,46,0.68)',
    },
    border: { thickness: 6, color: '#ffffff' },
    copy: {
      headline: 'Spring Holidays Music Makers Program',
      blurbParagraphs: [
        "Come spend two days creating original music with other young people in a relaxed, supportive environment. Share ideas, try something new, and jam as a band.",
        "Whatever you play, and whether you're quiet, confident, or just giving it a go &mdash; there's a place for you. Don't own an instrument? No worries &mdash; we've got plenty.",
      ],
      address: '5 Woodville Lane',
      agenote: "(Get in touch if you don't fit the age bracket.)",
      instrumentLines: [],
    },
    qrCard: true,
    qrCardMatchHeadlineWidth: true,
    qrCardMatchLineIndex: 1,
    qrCardJustify: 'space-evenly',
    logoMatchHeadlineHeight: true,
  },
  {
    key: 'v6f-friends-photo',
    file: 'good-noise-holiday-camp-flyer-v6f-friends-photo.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6f-friends-photo-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6f-friends-photo.html',
    note: 'Twin of v6b-concrete-border — only the background changed: friends-on-a-cliff photo, desaturated, forest overlay on top',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    tagline: { family: "'Outfit', sans-serif", weight: 800, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '800 16px "Outfit"' },
    taglineLines: ['One song.', 'Two days.', 'A tonne of new mates.'],
    bodyFamilyName: 'Inter',
    spacing: {
      headlineMarginTop: 8, taglineMarginTop: 4, dividerMarginTop: 4, blurbMarginTop: 4, infoMarginTop: 5, qrMarginTop: 5,
      qrSize: 40, qrPadding: 5, qrCardTextGap: 0, qrCardPaddingX: 0,
      qrCardCaptionSize: 4.2, qrCardLocationSize: 5,
      qrCardDateSize: 5.6, qrCardDateWeight: 700, qrCardDateMarginTop: 3,
      qrCardTimeSize: 5.6, qrCardTimeWeight: 700, qrCardTimeColor: COLOR_BRAND,
      infoProgramSize: 6.5, agenoteWeight: 800, agenoteSize: 5, instrumentSize: 5,
      logoWidth: 40, logoMarginTop: 4, blurbWeight: 700,
      infoProgramColor: '#ffffff', infoAgenoteColor: '#ffffff', infoInstrumentColor: COLOR_TERRACOTTA,
    },
    background: {
      type: 'image', dataUri: PHOTO_FRIENDS_CLIFF_DATA_URI, grayscale: true,
      size: 'cover', position: '45% 40%', overlayColor: 'rgba(31,61,46,0.68)',
    },
    border: { thickness: 6, color: '#ffffff' },
    copy: {
      address: '5 Woodville Lane',
      agenote: "(Get in touch if you don't fit the age bracket.)",
      instrumentLines: ["Don't own an instrument?", "No worries &mdash; we've got plenty."],
    },
    qrCard: true,
    qrCardMatchHeadlineWidth: true,
    qrCardMatchLineIndex: 1,
    qrCardJustify: 'space-evenly',
    logoMatchHeadlineHeight: true,
  },
  {
    key: 'v6d-fjalla',
    file: 'good-noise-holiday-camp-flyer-v6d-fjalla.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v6d-fjalla-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v6d-fjalla.html',
    note: 'Twin of v6b-concrete-border — identical background/border/spacing, only H1+H2 font differs (Fjalla One, free-license stand-in for Alvaro Condensed)',
    headline: { family: "'Fjalla One', sans-serif", weight: 400, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '400 16px "Fjalla One"' },
    tagline: { family: "'Fjalla One', sans-serif", weight: 400, size: '7.6mm', lineHeight: 1.2, letterSpacing: '0.01em', loadSpec: '400 16px "Fjalla One"' },
    bodyFamilyName: 'Inter',
    background: { type: 'image', dataUri: TEXTURE_CONCRETE_DATA_URI, position: 'center', overlayColor: 'rgba(31,61,46,0.78)' },
    border: { thickness: 6, color: '#ffffff' },
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
  },
  {
    key: 'v7-outfit-mono',
    file: 'good-noise-holiday-camp-flyer-v7-outfit-mono.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v7-outfit-mono-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v7-outfit-mono.html',
    note: 'Outfit throughout (headline + body, weight-differentiated) — single-typeface system, maximum cohesion',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Outfit',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
  },
  {
    key: 'v8-outfit-manrope',
    file: 'good-noise-holiday-camp-flyer-v8-outfit-manrope.pdf',
    previewFile: 'good-noise-holiday-camp-flyer-v8-outfit-manrope-preview.png',
    htmlFile: 'good-noise-holiday-camp-flyer-v8-outfit-manrope.html',
    note: 'Outfit headline + Manrope body — warmer/rounder geometric cousin, more personality than Inter without tipping kiddie',
    headline: { family: "'Outfit', sans-serif", weight: 800, size: '18mm', lineHeight: 1.06, letterSpacing: '-0.005em', textTransform: 'uppercase', loadSpec: '800 16px "Outfit"' },
    bodyFamilyName: 'Manrope',
    spacing: { headlineMarginTop: 7, taglineMarginTop: 6, dividerMarginTop: 6, blurbMarginTop: 6, infoMarginTop: 7, qrMarginTop: 7, qrSize: 38, qrPadding: 4 },
  },
];

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Inter:wght@400;500;600;700;800;900&family=Anton&family=Bungee&family=Permanent+Marker&family=Lexend:wght@900&family=Outfit:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Fjalla+One&display=swap';

// Default vertical rhythm, shared by every variant so v1-v4 stay byte-for-byte
// what was already approved-in-progress. Variants with a taller multi-line
// uppercase headline (v5, v6) override just enough of this to reclaim room —
// see `spacing` per variant below.
const DEFAULT_SPACING = {
  headlineMarginTop: 9,
  taglineMarginTop: 8,
  dividerMarginTop: 8,
  blurbMarginTop: 8,
  infoMarginTop: 9,
  qrMarginTop: 10,
  qrSize: 44,
  qrPadding: 5,
  infoProgramSize: 4.6,
  agenoteWeight: 600,
  qrCardTextGap: 5,
  qrCardCaptionSize: 3.6,
  qrCardLocationSize: 4,
  qrCardDateSize: 4.4,
  qrCardDateWeight: 700,
  qrCardTimeSize: 3.8,
  qrCardTimeWeight: 600,
  qrCardTimeColor: null, // null = muted forest (resolved inline in the CSS rule)
  logoWidth: 32,
  blurbWeight: 500,
  agenoteSize: 3.6,
  instrumentSize: 4.4,
  infoProgramColor: null, // null = COLOR_TERRACOTTA (resolved in buildHtml)
  infoAgenoteColor: null, // null = COLOR_TERRACOTTA
  infoInstrumentColor: null, // null = white
};

function buildHtml(variant) {
  const { headline } = variant;
  const spacing = { ...DEFAULT_SPACING, ...variant.spacing };
  const infoProgramColor = spacing.infoProgramColor || COLOR_TERRACOTTA;
  const infoAgenoteColor = spacing.infoAgenoteColor || COLOR_TERRACOTTA;
  const infoInstrumentColor = spacing.infoInstrumentColor || '#ffffff';
  const copy = {
    headline: 'School Holiday Songwriting Program',
    blurbParagraphs: ["Pick up songwriting the fun way. You'll write an original song with a group of other young people, then jam it out together."],
    address: null, // e.g. '5 Woodville Lane' — shown above the location line in the QR card when set
    agenote: "Get in touch if you don't fit the age bracket.",
    instrumentLines: ["Don't have an instrument? No worries — we've got plenty."], // set to [] to omit the standalone line (e.g. when folded into the blurb instead)
    ...variant.copy,
  };
  // bodyFamilyName covers everything but the headline — tagline (H2), blurb,
  // info block, QR caption/URL. Variants that predate this (v1-v5) keep
  // their own explicit `tagline` object instead; new variants (v6+) just
  // pick one name and it drives the whole rest of the type scale.
  const bodyFamilyName = variant.bodyFamilyName || 'Inter';
  const bodyFamily = `'${bodyFamilyName}', sans-serif`;
  const tagline = variant.tagline || {
    family: bodyFamily,
    weight: 800,
    size: '7.6mm',
    lineHeight: 1.2,
    letterSpacing: '0.01em',
    loadSpec: `800 16px "${bodyFamilyName}"`,
  };
  const taglineLines = variant.taglineLines || ['Two days.', 'One song.', 'A tonne of new mates.'];
  const background = variant.background || { type: 'flat' };
  const border = variant.border || null;
  const artworkInset = border ? `${border.thickness}mm` : '0';
  const qrCard = variant.qrCard || false;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${GOOGLE_FONTS_URL}" rel="stylesheet">
<style>
  @page { size: ${CANVAS_W}mm ${CANVAS_H}mm; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: ${CANVAS_W}mm;
    height: ${CANVAS_H}mm;
    background: ${COLOR_BRAND};
    font-family: ${bodyFamily};
  }
  .page {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .bg-white-border {
    position: absolute;
    inset: 0;
    background: ${border ? border.color : '#ffffff'};
  }
  .bg-flat {
    position: absolute;
    inset: ${artworkInset};
    background: ${COLOR_BRAND};
  }
  .bg-image {
    position: absolute;
    inset: ${artworkInset};
    background-image: url("${background.dataUri}");
    background-size: ${background.size || 'cover'};
    background-position: ${background.position || 'center'};
    filter: ${background.grayscale ? 'grayscale(100%)' : 'none'};
  }
  .bg-overlay {
    position: absolute;
    inset: ${artworkInset};
    background: ${background.overlayColor || 'transparent'};
  }
  .grain {
    position: absolute;
    inset: ${artworkInset};
    opacity: 0.05;
    background-repeat: repeat;
    background-size: 6mm 6mm;
    pointer-events: none;
  }
  .content {
    position: absolute;
    left: ${INSET}mm;
    top: ${INSET}mm;
    width: ${CANVAS_W - INSET * 2}mm;
    height: ${CANVAS_H - INSET * 2}mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .logo { width: ${spacing.logoWidth}mm; height: ${spacing.logoWidth * logoAspect}mm; margin-top: ${spacing.logoMarginTop ?? 2}mm; flex-shrink: 0; }
  .headline {
    font-family: ${headline.family};
    font-weight: ${headline.weight};
    color: #ffffff;
    font-size: ${headline.size};
    line-height: ${headline.lineHeight};
    letter-spacing: ${headline.letterSpacing};
    text-transform: ${headline.textTransform || 'none'};
    margin-top: ${spacing.headlineMarginTop}mm;
  }
  .tagline {
    font-family: ${tagline.family};
    font-weight: ${tagline.weight};
    color: ${COLOR_TERRACOTTA};
    font-size: ${tagline.size};
    line-height: ${tagline.lineHeight};
    letter-spacing: ${tagline.letterSpacing};
    margin-top: ${spacing.taglineMarginTop}mm;
  }
  .divider {
    width: 42mm;
    height: 1.6mm;
    border-radius: 999px;
    background: ${COLOR_SAGE};
    margin-top: ${spacing.dividerMarginTop}mm;
  }
  .blurb {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3mm;
    font-size: 5mm;
    font-weight: ${spacing.blurbWeight};
    line-height: 1.42;
    color: rgba(255,255,255,0.88);
    max-width: 108mm;
    margin-top: ${spacing.blurbMarginTop}mm;
  }
  .info {
    margin-top: ${spacing.infoMarginTop}mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3mm;
  }
  .info-location {
    font-weight: 800;
    font-size: 4.8mm;
    letter-spacing: 0.02em;
    color: #ffffff;
  }
  .info-program {
    font-weight: 700;
    font-size: ${spacing.infoProgramSize}mm;
    line-height: 1.3;
    color: ${infoProgramColor};
  }
  .info-program .age { font-weight: 800; }
  .info-agenote {
    font-weight: ${spacing.agenoteWeight};
    font-size: ${spacing.agenoteSize}mm;
    line-height: 1.3;
    color: ${infoAgenoteColor};
    max-width: 120mm;
  }
  .qr-wrap {
    margin-top: ${spacing.qrMarginTop}mm;
    background: ${COLOR_CREAM};
    border-radius: 5mm;
    padding: ${spacing.qrPadding}mm;
  }
  .qr-wrap svg { display: block; width: ${spacing.qrSize}mm; height: ${spacing.qrSize}mm; }
  .qr-card {
    margin-top: ${spacing.qrMarginTop}mm;
    background: ${COLOR_CREAM};
    border-radius: 5mm;
    padding: ${spacing.qrPadding}mm ${spacing.qrCardPaddingX ?? spacing.qrPadding + 3}mm;
    display: flex;
    align-items: center;
    gap: ${spacing.qrCardTextGap}mm;
  }
  .qr-card-qr-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2mm;
  }
  .qr-card-caption {
    font-weight: 700;
    font-size: ${spacing.qrCardCaptionSize}mm;
    color: ${COLOR_BRAND};
    text-align: center;
  }
  .qr-card svg { display: block; width: ${spacing.qrSize}mm; height: ${spacing.qrSize}mm; }
  .qr-card-text { text-align: left; }
  .qr-card-address {
    font-weight: 700;
    font-size: ${spacing.qrCardLocationSize}mm;
    color: ${COLOR_BRAND};
  }
  .qr-card-location {
    font-weight: 800;
    font-size: ${spacing.qrCardLocationSize}mm;
    letter-spacing: 0.04em;
    color: ${COLOR_BRAND};
    margin-top: ${copy.address ? '0.5mm' : '0mm'};
  }
  .qr-card-date {
    font-weight: ${spacing.qrCardDateWeight};
    font-size: ${spacing.qrCardDateSize}mm;
    color: ${COLOR_BRAND};
    margin-top: ${spacing.qrCardDateMarginTop ?? 1.5}mm;
  }
  .qr-card-time {
    font-weight: ${spacing.qrCardTimeWeight};
    font-size: ${spacing.qrCardTimeSize}mm;
    color: ${spacing.qrCardTimeColor || 'rgba(31,61,46,0.75)'};
    margin-top: 0.5mm;
  }
  .info-instrument {
    font-weight: 700;
    font-size: ${spacing.instrumentSize}mm;
    line-height: 1.3;
    color: ${infoInstrumentColor};
    max-width: 120mm;
    margin-top: 1mm;
  }
  .qr-caption {
    margin-top: 4mm;
    font-weight: 600;
    font-size: 3.4mm;
    color: rgba(255,255,255,0.7);
  }
  .qr-url {
    margin-top: 1.5mm;
    font-weight: 700;
    font-size: 4.4mm;
    color: #ffffff;
  }
  .spacer { flex: 1; min-height: 4mm; }
</style>
</head>
<body>
<div class="page">
  ${border ? '<div class="bg-white-border"></div>' : ''}
  ${border && background.type !== 'image' ? '<div class="bg-flat"></div>' : ''}
  ${background.type === 'image' ? '<div class="bg-image"></div><div class="bg-overlay"></div>' : ''}
  <div class="grain" id="grain"></div>
  <div class="content">
    <svg class="logo" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}"><path fill="#ffffff" d="${logoPathD}"/></svg>

    <div class="headline" id="headline">${copy.headline}</div>

    <div class="tagline">
      ${taglineLines.join('<br>\n      ')}
    </div>

    <div class="divider"></div>

    <div class="blurb">
      ${copy.blurbParagraphs.map((p) => `<p style="margin:0;">${p}</p>`).join('\n      ')}
    </div>

    <div class="info">
      ${qrCard ? '' : '<div class="info-location">NORTH PERTH &middot; 30 Sep &ndash; 1 Oct &middot; 9am&ndash;3pm</div>'}
      <div class="info-program">
        <span class="age">Ages 14&ndash;17</span>
      </div>
      <div class="info-agenote">${copy.agenote}</div>
      ${copy.instrumentLines.length ? `<div class="info-instrument">${copy.instrumentLines.join('<br>\n      ')}</div>` : ''}
    </div>

    <div class="spacer"></div>

    ${qrCard
      ? `<div class="qr-card" id="qr-card">
      <div class="qr-card-qr-col">
        <div class="qr-card-caption">Scan for bookings</div>
        <div class="qr-card-qr">${qrSvg}</div>
      </div>
      <div class="qr-card-text">
        ${copy.address ? `<div class="qr-card-address">${copy.address}</div>` : ''}
        <div class="qr-card-location">NORTH PERTH</div>
        <div class="qr-card-date">30 Sep &ndash; 1 Oct</div>
        <div class="qr-card-time">9am&ndash;3pm</div>
      </div>
    </div>
    <div class="qr-url">goodnoiseproject.com.au/holiday-camps</div>`
      : `<div class="qr-wrap">${qrSvg}</div>
    <div class="qr-caption">Scan for bookings</div>
    <div class="qr-url">goodnoiseproject.com.au/holiday-camps</div>`}
  </div>
</div>
</body>
</html>`;
}

const PX_PER_MM = 96 / 25.4; // CSS px at 96dpi
const PT_PER_MM = 72 / 25.4;
const widthPt = (CANVAS_W * PT_PER_MM).toFixed(6);
const heightPt = (CANVAS_H * PT_PER_MM).toFixed(6);

const browser = await chromium.launch();

const keyFilter = process.argv[2]; // optional: node script.mjs v5-lexend,v6-outfit
const requestedKeys = keyFilter ? keyFilter.split(',') : null;
const variantsToRun = requestedKeys ? VARIANTS.filter((v) => requestedKeys.includes(v.key)) : VARIANTS;

for (const variant of variantsToRun) {
  console.log(`\n=== ${variant.key}: ${variant.note} ===`);
  const html = buildHtml(variant);
  writeFileSync(path.join(OUT_DIR, variant.htmlFile), html);

  const page = await browser.newPage({
    deviceScaleFactor: 4,
    viewport: { width: Math.round(CANVAS_W * PX_PER_MM), height: Math.round(CANVAS_H * PX_PER_MM) },
  });
  await page.setContent(html);

  await page.evaluate(() => {
    const grainSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise" />
        <feColorMatrix in="noise" type="saturate" values="0" result="desat" />
        <feComponentTransfer in="desat">
          <feFuncR type="linear" slope="3" intercept="-1" />
          <feFuncG type="linear" slope="3" intercept="-1" />
          <feFuncB type="linear" slope="3" intercept="-1" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>`;
    document.getElementById('grain').style.backgroundImage =
      `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`;
  });

  const bodyFamilyName = variant.bodyFamilyName || 'Inter';
  const fontSpecs = [
    variant.headline.loadSpec,
    variant.tagline?.loadSpec ?? `800 16px "${bodyFamilyName}"`,
    `500 16px "${bodyFamilyName}"`,
    `600 16px "${bodyFamilyName}"`,
    `700 16px "${bodyFamilyName}"`,
  ];
  await page.evaluate(async (specs) => {
    for (const spec of specs) await document.fonts.load(spec);
    await document.fonts.ready;
  }, fontSpecs);
  await page.waitForTimeout(200);

  // Some variants want the QR card's width, and/or the logo's size, matched
  // against the headline's actual rendered geometry (e.g. card flush with
  // the edges of "SONGWRITING", logo height matched to the headline's cap
  // height). The headline wraps via the browser's own line-breaking, so
  // none of this is computable from the font config alone — it has to be
  // measured post-layout with a Range over the text node, which returns one
  // client rect per wrapped line. Measure everything first, then apply the
  // DOM patches, so later measurements aren't thrown off by earlier resizes.
  if (variant.qrCardMatchHeadlineWidth || variant.logoMatchHeadlineHeight) {
    const result = await page.evaluate(({ CANVAS_W, INSET, lineIndex }) => {
      const headline = document.getElementById('headline');
      const range = document.createRange();
      range.selectNodeContents(headline);
      const rects = range.getClientRects();
      const contentRect = document.querySelector('.content').getBoundingClientRect();
      const pxPerMm = contentRect.width / (CANVAS_W - INSET * 2);
      return {
        lineWidthMm: rects[lineIndex].width / pxPerMm,
        firstLineHeightMm: rects[0].height / pxPerMm,
      };
    }, { CANVAS_W, INSET, lineIndex: variant.qrCardMatchLineIndex ?? 0 });

    if (variant.qrCardMatchHeadlineWidth) {
      // 'space-between' (the default) pushes the QR and text to the card's
      // outer edges, which can leave a much bigger gap between them than
      // the padding on either side — looks lopsided on a wide card.
      // 'center' keeps a fixed, deliberate gap between QR and text and lets
      // the leftover width split evenly as margin on both sides instead.
      await page.evaluate(({ widthMm, justify }) => {
        const card = document.getElementById('qr-card');
        if (card) {
          card.style.width = `${widthMm}mm`;
          card.style.justifyContent = justify;
        }
      }, { widthMm: result.lineWidthMm, justify: variant.qrCardJustify || 'space-between' });
      console.log(`[${variant.key}] QR card width matched to headline line ${variant.qrCardMatchLineIndex ?? 0}: ${result.lineWidthMm.toFixed(1)}mm`);
    }

    if (variant.logoMatchHeadlineHeight) {
      // getBBox() reads the path's true bounding box in SVG user-unit space
      // (viewBox coordinates) — layout/viewport-independent, unlike
      // getBoundingClientRect() on the rendered element, which measured the
      // logo's own box (with its CSS-set width/height) rather than the
      // ink within it and produced a wildly wrong scale factor.
      const inkRatio = await page.evaluate(() => {
        const path = document.querySelector('.logo path');
        return path.getBBox().height;
      }) / LOGO_VB_H;
      const logoWidthMm = result.firstLineHeightMm / (logoAspect * inkRatio);
      await page.evaluate(({ logoWidthMm, logoAspect }) => {
        const logo = document.querySelector('.logo');
        if (logo) {
          logo.style.width = `${logoWidthMm}mm`;
          logo.style.height = `${logoWidthMm * logoAspect}mm`;
        }
      }, { logoWidthMm, logoAspect });
      console.log(`[${variant.key}] Logo ink height matched to headline first-line height (${result.firstLineHeightMm.toFixed(1)}mm): logo width now ${logoWidthMm.toFixed(1)}mm`);
      const actualLogoRect = await page.evaluate(({ CANVAS_W, INSET }) => {
        const logo = document.querySelector('.logo');
        const r = logo.getBoundingClientRect();
        const contentRect = document.querySelector('.content').getBoundingClientRect();
        const pxPerMm = contentRect.width / (CANVAS_W - INSET * 2);
        return { widthMm: r.width / pxPerMm, heightMm: r.height / pxPerMm, cssWidth: logo.style.width, cssHeight: logo.style.height };
      }, { CANVAS_W, INSET });
      console.log(`[${variant.key}] Actual rendered logo box:`, actualLogoRect);
    }

    if (variant.qrCard) {
      const gaps = await page.evaluate(({ CANVAS_W, INSET }) => {
        const card = document.getElementById('qr-card');
        const qrCol = card.querySelector('.qr-card-qr-col');
        const textCol = card.querySelector('.qr-card-text');
        const cardRect = card.getBoundingClientRect();
        const qrRect = qrCol.getBoundingClientRect();
        const textRect = textCol.getBoundingClientRect();
        const contentRect = document.querySelector('.content').getBoundingClientRect();
        const pxPerMm = contentRect.width / (CANVAS_W - INSET * 2);
        return {
          leftMarginMm: (qrRect.left - cardRect.left) / pxPerMm,
          middleGapMm: (textRect.left - qrRect.right) / pxPerMm,
          rightMarginMm: (cardRect.right - textRect.right) / pxPerMm,
          cardWidthMm: cardRect.width / pxPerMm,
        };
      }, { CANVAS_W, INSET });
      console.log(`[${variant.key}] QR-card gaps (mm):`, gaps);
    }
  }

  const report = await page.evaluate(
    ({ INSET, CANVAS_W, CANVAS_H }) => {
      const content = document.querySelector('.content');
      const rect = content.getBoundingClientRect();
      const pxPerMm = rect.width / (CANVAS_W - INSET * 2);
      const scrollH = content.scrollHeight;
      return {
        overflowMm: (content.scrollHeight - rect.height) / pxPerMm,
        contentHeightMm: scrollH / pxPerMm,
        availableHeightMm: CANVAS_H - INSET * 2,
      };
    },
    { INSET, CANVAS_W, CANVAS_H },
  );
  console.log('Safe-area report (mm):', report);
  if (report.overflowMm > 0.5) {
    console.warn(`WARNING [${variant.key}]: content overflows safe area by ~${report.overflowMm.toFixed(1)}mm — reduce font size/gaps.`);
  }

  await page.screenshot({ path: path.join(OUT_DIR, variant.previewFile) });

  const TMP_DIR = mkdtempSync(path.join(tmpdir(), `good-noise-flyer-${variant.key}-`));
  const rgbPdfPath = path.join(TMP_DIR, 'flyer-rgb.pdf');
  await page.pdf({
    path: rgbPdfPath,
    width: `${CANVAS_W}mm`,
    height: `${CANVAS_H}mm`,
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    preferCSSPageSize: true,
  });
  await page.close();

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

  console.log(`[${variant.key}] Print-ready CMYK PDF written to`, finalPdfPath);
  rmSync(TMP_DIR, { recursive: true, force: true });
}

await browser.close();
console.log('\nAll variants generated in', OUT_DIR);
