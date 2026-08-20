import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOCIAL_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(SOCIAL_ROOT, 'assets', 'images');

const SLOTS = [
  { id: '06-05', desc: 'Hands on instruments, or you playing. Faces optional.' },
  { id: '08-01', desc: 'Player 1 Music School — wide shot of the room.' },
  { id: '08-03', desc: 'Instrument detail: kit, amp, pedal, mic stand.' },
];

function placeholderHtml(slot) {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="stylesheet" href="../../src/tokens.css" />
<link rel="stylesheet" href="../../src/base.css" />
<style>
  .placeholder{width:1080px;height:1350px;}
</style>
</head>
<body>
  <div class="placeholder">
    <div class="placeholder-inner">
      <div class="placeholder-slot">${slot.id}</div>
      <div class="placeholder-desc">${slot.desc}</div>
    </div>
  </div>
</body></html>`;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

  const tmpDir = path.join(SOCIAL_ROOT, '.build-tmp', 'placeholders');
  const fs = await import('node:fs/promises');
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  for (const slot of SLOTS) {
    const htmlPath = path.join(tmpDir, `${slot.id}.html`);
    await fs.writeFile(htmlPath, placeholderHtml(slot), 'utf-8');
    await page.goto(`file://${htmlPath}`);
    await page.waitForTimeout(50);
    const outPath = path.join(IMAGES_DIR, `${slot.id}.png`);
    await page.screenshot({ path: outPath });
    console.log(`  placeholder -> ${path.relative(SOCIAL_ROOT, outPath)}`);
  }

  await browser.close();
  await fs.rm(tmpDir, { recursive: true, force: true });
}

main();
