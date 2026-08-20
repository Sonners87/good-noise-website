// Template library — five self-contained functions, each takes a slide data
// object (from social/content/post-XX.json) and returns the inner HTML for
// that slide's <div class="slide">. Copy is never hardcoded here.

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function groundClass(ground) {
  return `ground-${ground}`;
}

// Optional per-slide palette override (e.g. "forest" for the 2026 spring
// holiday workshop's forest/burnt legacy colours) — see .palette-forest
// in tokens.css. Most slides don't set this.
function slideClasses(data, extra) {
  const classes = ['slide', extra, groundClass(data.ground)];
  if (data.palette) classes.push(`palette-${data.palette}`);
  return classes.join(' ');
}

// Headlines may mark a word/phrase for the highlight-box treatment with
// [[double brackets]], e.g. "MUSIC'S [[BETTER]] SHARED." — matches .gn-hl
// on the live site. Everything else in this function still escapes text;
// only the [[...]] delimiters themselves are treated as markup.
function formatHeadline(text) {
  if (text === null || text === undefined) return '';
  const parts = String(text).split(/\[\[(.+?)\]\]/g);
  return parts
    .map((part, i) => (i % 2 === 1 ? `<span class="hl">${esc(part)}</span>` : esc(part)))
    .join('');
}

// Paths are relative to the scratch HTML file the build writes into
// social/.build-tmp/ (one level below social/) — see build.mjs.
function logoImg() {
  return `<img class="logo" src="../assets/logo/good-noise-logo-cream.png" alt="" />`;
}

export function t1(data) {
  const { eyebrow, headline, body, cta } = data;
  return `
  <div class="${slideClasses(data, 't1')}">
    <div class="safe">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="headline-wrap"><div class="headline" data-autofit data-min="88" data-max="140">${formatHeadline(headline)}</div></div>
      ${body ? `<div class="body-text">${esc(body)}</div>` : ''}
      ${cta ? `<div class="cta-line">${esc(cta)}</div>` : ''}
    </div>
    ${logoImg()}
  </div>`;
}

export function t2(data) {
  const { eyebrow, rows } = data;
  const rowsHtml = (rows || [])
    .map(
      (r) => `
      <div class="row">
        <div class="row-label">${esc(r.label)}</div>
        <div class="row-value">${esc(r.value)}</div>
      </div>`
    )
    .join('');
  return `
  <div class="${slideClasses(data, 't2')}">
    <div class="safe">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="rows">${rowsHtml}</div>
    </div>
    ${logoImg()}
  </div>`;
}

export function t3(data) {
  const { number, eyebrow, headline } = data;
  return `
  <div class="${slideClasses(data, 't3')}">
    <div class="safe">
      <div class="number-block">${esc(number)}</div>
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="headline-wrap"><div class="headline" data-autofit data-min="88" data-max="120">${formatHeadline(headline)}</div></div>
    </div>
    ${logoImg()}
  </div>`;
}

export function t4(data) {
  const { imageSrc, headline, sub } = data;
  return `
  <div class="${slideClasses(data, 't4')}">
    <div class="safe">
      <div class="frame">
        <img src="${esc(imageSrc)}" alt="" />
        <div class="duotone"></div>
        <div class="scrim"></div>
      </div>
      <div class="text-block">
        <div class="headline" data-autofit data-min="72" data-max="104">${formatHeadline(headline)}</div>
        ${sub ? `<div class="sub">${esc(sub)}</div>` : ''}
      </div>
    </div>
    ${logoImg()}
  </div>`;
}

export function t5(data) {
  const { badge, price, oldPrice, priceNote, cta, footnote } = data;
  return `
  <div class="${slideClasses(data, 't5')}">
    <div class="safe">
      ${badge ? `<div class="badge">${esc(badge)}</div>` : ''}
      <div class="price-block">
        <div class="price-row">
          ${oldPrice ? `<div class="price-old">${esc(oldPrice)}</div>` : ''}
          <div class="price-new" data-autofit data-min="100" data-max="150">${esc(price)}</div>
        </div>
        ${priceNote ? `<div class="price-note">${esc(priceNote)}</div>` : ''}
      </div>
      ${cta ? `<div class="cta-block">${esc(cta)}</div>` : ''}
      ${footnote ? `<div class="footnote">${esc(footnote)}</div>` : ''}
    </div>
    ${logoImg()}
  </div>`;
}

export const templates = { T1: t1, T2: t2, T3: t3, T4: t4, T5: t5 };
