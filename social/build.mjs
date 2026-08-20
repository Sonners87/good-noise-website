#!/usr/bin/env node
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderSlideHtml } from './src/render.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOCIAL_ROOT = __dirname;
const CONTENT_DIR = path.join(SOCIAL_ROOT, 'content');
const OUTPUT_DIR = path.join(SOCIAL_ROOT, 'output');
const IMAGES_DIR = path.join(SOCIAL_ROOT, 'assets', 'images');
const TMP_DIR = path.join(SOCIAL_ROOT, '.build-tmp');

function runAutofit() {
  const nodes = document.querySelectorAll('[data-autofit]');
  nodes.forEach((el) => {
    const min = parseInt(el.dataset.min, 10);
    const max = parseInt(el.dataset.max, 10);
    const box = el.closest('.safe');
    let size = max;
    el.style.fontSize = size + 'px';
    const overflowing = () => box.scrollHeight > box.clientHeight + 1;
    while (overflowing() && size > min) {
      size -= 4;
      el.style.fontSize = size + 'px';
    }
  });
}

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

async function resolveImageSrc(slot) {
  for (const ext of ['jpg', 'jpeg', 'png']) {
    const p = path.join(IMAGES_DIR, `${slot}.${ext}`);
    if (existsSync(p)) return `../assets/images/${slot}.${ext}`;
  }
  throw new Error(`No image found for slot "${slot}" in ${IMAGES_DIR}`);
}

async function loadPost(id) {
  const file = path.join(CONTENT_DIR, `post-${id}.json`);
  const raw = await fs.readFile(file, 'utf-8');
  const post = JSON.parse(raw);
  for (const slide of post.slides) {
    if (slide.template === 'T4' && slide.image) {
      slide.imageSrc = await resolveImageSrc(slide.image);
    }
  }
  return post;
}

function slideFileBase(post, index) {
  const n = String(index + 1).padStart(2, '0');
  return `post-${post.id}-slide-${n}`;
}

function combinedHtml(post) {
  const bodies = post.slides
    .map((slide) => {
      const full = renderSlideHtml(slide);
      const match = full.match(/<body>([\s\S]*)<\/body>/);
      return match[1];
    })
    .join('\n');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="../src/tokens.css" />
<link rel="stylesheet" href="../src/base.css" />
<style>
  @page { size: 1080px 1350px; margin: 0; }
  .slide { page-break-after: always; }
  .slide:last-child { page-break-after: avoid; }
</style>
</head>
<body>
${bodies}
</body>
</html>`;
}

async function buildPost(browser, id) {
  const post = await loadPost(id);
  const postOutDir = path.join(OUTPUT_DIR, `post-${post.id}`);
  await fs.mkdir(postOutDir, { recursive: true });
  await fs.mkdir(TMP_DIR, { recursive: true });

  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2,
  });

  console.log(`\nPost ${post.id} — ${post.name}`);

  for (let i = 0; i < post.slides.length; i++) {
    const slide = post.slides[i];
    const base = slideFileBase(post, i);
    const html = renderSlideHtml(slide);
    const htmlPath = path.join(TMP_DIR, `${base}.html`);
    await fs.writeFile(htmlPath, html, 'utf-8');

    await page.goto(`file://${htmlPath}`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(runAutofit);

    const pngPath = path.join(postOutDir, `${base}.png`);
    await page.screenshot({ path: pngPath });

    const pdfPath = path.join(postOutDir, `${base}.pdf`);
    await page.pdf({
      width: '1080px',
      height: '1350px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
      path: pdfPath,
    });

    console.log(`  slide ${i + 1}/${post.slides.length} -> ${base}.png / .pdf`);
  }

  // Multi-page PDF, all slides in order, in one document.
  const allHtml = combinedHtml(post);
  const allHtmlPath = path.join(TMP_DIR, `post-${post.id}-all.html`);
  await fs.writeFile(allHtmlPath, allHtml, 'utf-8');
  await page.goto(`file://${allHtmlPath}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(runAutofit);
  const allPdfPath = path.join(postOutDir, `post-${post.id}-all.pdf`);
  await page.pdf({
    width: '1080px',
    height: '1350px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
    path: allPdfPath,
  });
  console.log(`  all slides -> post-${post.id}-all.pdf`);

  await page.close();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let ids;
  if (args.post) {
    ids = [args.post.padStart(2, '0')];
  } else {
    const files = await fs.readdir(CONTENT_DIR);
    ids = files
      .filter((f) => /^post-\d+\.json$/.test(f))
      .map((f) => f.match(/^post-(\d+)\.json$/)[1])
      .sort();
  }

  const browser = await chromium.launch();
  try {
    for (const id of ids) {
      await buildPost(browser, id);
    }
  } finally {
    await browser.close();
    await fs.rm(TMP_DIR, { recursive: true, force: true });
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
