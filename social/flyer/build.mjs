#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { renderFlyerHtml } from './src/template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FLYER_ROOT = __dirname;
const OUTPUT_DIR = path.join(FLYER_ROOT, 'output');
const TMP_DIR = path.join(FLYER_ROOT, '.build-tmp');

const content = JSON.parse(await fs.readFile(path.join(FLYER_ROOT, 'content.json'), 'utf-8'));

// 96 CSS px per inch is the fixed reference Chromium uses regardless of
// deviceScaleFactor — mm/in-sized PDF pages must be sized against that,
// not against the raster resolution deviceScaleFactor buys.
const CSS_PX_PER_MM = 96 / 25.4;
const A4_W_MM = 210;
const A4_H_MM = 297;
const A4_VIEWPORT_W = Math.round(A4_W_MM * CSS_PX_PER_MM);
const A4_VIEWPORT_H = Math.round(A4_H_MM * CSS_PX_PER_MM);

const STEPS = new Set(
  process.argv.includes('--only')
    ? [process.argv[process.argv.indexOf('--only') + 1]]
    : ['png', 'sms', 'square', 'pdf'],
);

async function writeHtml(name, html) {
  await fs.mkdir(TMP_DIR, { recursive: true });
  const p = path.join(TMP_DIR, name);
  await fs.writeFile(p, html, 'utf-8');
  return p;
}

async function waitForFonts(page) {
  await page.evaluate(async () => {
    await document.fonts.load('400 16px "Anton"');
    await document.fonts.load('400 16px "Work Sans"');
    await document.fonts.load('500 16px "Work Sans"');
    await document.fonts.load('400 16px "Space Mono"');
    await document.fonts.load('700 16px "Space Mono"');
    await document.fonts.ready;
  });
}

// ---- 1. Messaging PNG — 1080x1620 (2:3), rendered at deviceScaleFactor 2 ----
async function buildPng(browser) {
  const html = renderFlyerHtml(content, { compact: false });
  const htmlPath = await writeHtml('gn-jam-flyer.html', html);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1620 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`);
  await waitForFonts(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'gn-jam-flyer.png') });
  await page.close();
  console.log('gn-jam-flyer.png -> 2160x3240 (1080x1620 @2x)');
}

// ---- 2. SMS JPEG — same artboard, compressed under 500KB ----
// Rendered fresh at deviceScaleFactor 1: MMS carriers recompress hard, so
// there's no benefit to shipping 2x pixels only to have them thrown away —
// better to spend the JPEG quality budget on a smaller image.
async function buildSms(browser) {
  const html = renderFlyerHtml(content, { compact: false });
  const htmlPath = await writeHtml('gn-jam-flyer.html', html);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1620 },
    deviceScaleFactor: 1,
  });
  await page.goto(`file://${htmlPath}`);
  await waitForFonts(page);
  let quality = 82;
  let buffer = await page.screenshot({ type: 'jpeg', quality });
  while (buffer.length > 500 * 1024 && quality > 40) {
    quality -= 6;
    buffer = await page.screenshot({ type: 'jpeg', quality });
  }
  await page.close();
  await fs.writeFile(path.join(OUTPUT_DIR, 'gn-jam-flyer-sms.jpg'), buffer);
  console.log(`gn-jam-flyer-sms.jpg -> ${(buffer.length / 1024).toFixed(0)}KB at quality ${quality}`);
  if (buffer.length > 500 * 1024) {
    console.warn('  WARNING: still over 500KB at quality 40 — needs a manual look.');
  }
}

// ---- 3. Square PNG — 1080x1350 (4:5), compact layout ----
async function buildSquare(browser) {
  const html = renderFlyerHtml(content, { compact: true });
  const htmlPath = await writeHtml('gn-jam-flyer-square.html', html);
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`);
  await waitForFonts(page);
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'gn-jam-flyer-square.png') });
  await page.close();
  console.log('gn-jam-flyer-square.png -> 2160x2700 (1080x1350 @2x)');
}

// ---- 4. A4 PDF — live text, QR code, zero margin ----
async function buildPdf(browser) {
  // Cream-on-green, per the brief — the footer it sits in is the forest
  // ground, so ink-coloured modules would vanish against it (same bug
  // class as the card shadow above).
  const qrDataUri = await QRCode.toDataURL(content.qrUrl, {
    errorCorrectionLevel: 'Q',
    margin: 0,
    color: { dark: '#F4F0E6', light: '#00000000' },
  });
  const html = renderFlyerHtml(content, { compact: false, tight: true, qrDataUri });
  const htmlPath = await writeHtml('gn-jam-flyer.pdf.html', html);
  const page = await browser.newPage({
    viewport: { width: A4_VIEWPORT_W, height: A4_VIEWPORT_H },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${htmlPath}`);
  await waitForFonts(page);
  await page.pdf({
    path: path.join(OUTPUT_DIR, 'gn-jam-flyer.pdf'),
    width: `${A4_W_MM}mm`,
    height: `${A4_H_MM}mm`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  await page.close();
  console.log('gn-jam-flyer.pdf -> A4, live text, QR code');
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  if (STEPS.has('png')) await buildPng(browser);
  if (STEPS.has('sms')) await buildSms(browser);
  if (STEPS.has('square')) await buildSquare(browser);
  if (STEPS.has('pdf')) await buildPdf(browser);

  await browser.close();
  await fs.rm(TMP_DIR, { recursive: true, force: true });
  console.log('\nDone. Outputs in', OUTPUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
