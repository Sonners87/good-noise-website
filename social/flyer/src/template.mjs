import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..', '..');

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// "GOOD NOISE" + signal-mark icon, no "PROJECT" line — pre-coloured cream,
// matching the hero/footer's forest-green grounds.
const LOGO_CREAM_SVG = readFileSync(
  path.join(ROOT, 'src/assets/logo/good-noise-logo-cream.svg'),
  'utf8',
);

function benefitHtml(b) {
  return `
      <div class="benefit">
        <h3>${esc(b.headline)}</h3>
        <p>${esc(b.body)}</p>
      </div>`;
}

function rowHtml(row) {
  return `
      <div class="card-row">
        <span class="row-label">${esc(row.label)}</span>
        <span class="row-value">${esc(row.value)}</span>
      </div>`;
}

/**
 * @param {object} content - parsed content.json
 * @param {object} opts
 * @param {boolean} [opts.compact] - tighter vertical rhythm + shorter quote, for the 4:5 crop
 * @param {boolean} [opts.tight] - mild spacing trim (no text cuts), for A4: its aspect ratio
 *   (0.707) is proportionally taller relative to width than the 2:3 canvas (0.667), so the
 *   same vw-based rhythm overflows onto a second page without this.
 * @param {string} [opts.qrDataUri] - if set, renders a QR block in the footer (A4 only)
 */
export function renderFlyerHtml(content, opts = {}) {
  const { compact = false, tight = false, qrDataUri = null } = opts;

  const rowsHtml = content.infoRows.map(rowHtml).join('');
  const benefitsHtml = content.benefits.map(benefitHtml).join('');

  // The compressed quote drops its opening clause ("It wasn't footy after
  // school —") to buy back vertical space on the shorter 4:5 canvas, per
  // the brief's instruction to shed length there rather than shrink type.
  const quoteText = compact
    ? content.quote.text
        .replace(/^It wasn't footy after school — /, '')
        .replace(/^./, (c) => c.toUpperCase())
    : content.quote.text;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="../src/tokens.css" />
<link rel="stylesheet" href="../src/base.css" />
</head>
<body>
  <div class="flyer" data-compact="${compact ? 'true' : 'false'}" data-tight="${tight ? 'true' : 'false'}">

    <section class="zone zone-hero">
      <div class="hero-top">
        <div class="logo">${LOGO_CREAM_SVG}</div>
        <span class="eyebrow">${esc(content.eyebrow)}</span>
      </div>

      <h1 class="headline">
        ${esc(content.headline.pre)}<span class="hl">${esc(content.headline.highlight)}</span><br />${esc(content.headline.post)}
      </h1>

      <p class="subline">${esc(content.subline)}</p>

      <div class="card">
        ${rowsHtml}
        <div class="card-row price-row">
          <span class="row-label">How much</span>
          <span class="price-value-single">${esc(content.price.value)}</span>
        </div>
        <div class="price-note">${esc(content.price.note)}</div>
      </div>

      <p class="price-explainer">${esc(content.priceExplainer)}</p>
    </section>

    <section class="zone zone-scholarship">
      <div class="scholarship-rule"></div>
      <p class="scholarship-heading">${esc(content.scholarship.heading)}</p>
      <p class="scholarship-body">${esc(content.scholarship.body)}</p>
      <div class="scholarship-rule"></div>
    </section>

    <section class="zone zone-benefits">
      ${benefitsHtml}
    </section>

    <section class="zone zone-reassurance">
      <p>${esc(content.reassurance)}</p>
    </section>

    <section class="zone zone-quote">
      <div class="quote-rule"></div>
      <blockquote>&ldquo;${esc(quoteText)}&rdquo;</blockquote>
      <p class="attribution">${esc(content.quote.attribution)}</p>
      <div class="quote-rule"></div>
    </section>

    <section class="zone zone-cta">
      <a class="cta-button">${esc(content.cta.label)}</a>
      <p class="cta-url">${esc(content.cta.url)}</p>
      <p class="spots-limited">${esc(content.cta.spotsLimited)}</p>

      <div class="footer">
        <p class="footer-contact">${esc(content.footer.name)} &middot; ${esc(content.footer.email)} &middot; ${esc(content.footer.phone)}</p>
        <div class="footer-logo">${LOGO_CREAM_SVG}</div>
      </div>

      ${qrDataUri ? `
      <div class="qr-block">
        <img src="${qrDataUri}" alt="QR code" />
        <span class="qr-caption">Scan to book</span>
      </div>` : ''}
    </section>

  </div>
</body>
</html>`;
}
