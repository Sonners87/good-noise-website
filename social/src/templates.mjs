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
// social/.build-tmp/ (one level below social/) — see build.mjs. Sourced
// directly from the website's own logo assets (src/assets/logo) rather than
// a duplicate copy, same file social/flyer already treats as canonical.
function logoImg(variant) {
  const cls = variant === 'top' ? 'logo logo-top' : variant === 'center' ? 'logo logo-center' : 'logo';
  return `<img class="${cls}" src="../../src/assets/logo/good-noise-logo-cream.svg" alt="" />`;
}

export function t1(data) {
  const { eyebrow, headline, body, cta, heroLogo } = data;
  const classes = heroLogo ? slideClasses(data, 't1') + ' hero-logo' : slideClasses(data, 't1');
  return `
  <div class="${classes}">
    <div class="safe">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="copy-block">
        <div class="headline-wrap"><div class="headline" data-autofit data-min="88" data-max="140">${formatHeadline(headline)}</div></div>
        ${body ? `<div class="body-text">${esc(body)}</div>` : ''}
      </div>
      ${cta ? `<div class="cta-line">${esc(cta)}</div>` : ''}
    </div>
    ${logoImg(heroLogo ? 'top' : 'bottom')}
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

// T6 — ANNOUNCEMENT / CENTRED POSTER. A one-off, fully-centred composition
// that folds a title line, a date/location line, the headline, price and a
// CTA onto a single canvas — a deliberately different rhythm from T1-T5's
// left-aligned layouts, for a single-image "everything you need" post.
export function t6(data) {
  const {
    kicker,
    datesLine,
    locationLine,
    ageLabel,
    ageValue,
    headline,
    headlineMin,
    headlineMax,
    headlineNoWrap,
    badge,
    price,
    priceNote,
    cta,
    footnote,
  } = data;
  const headlineClass = headlineNoWrap ? 'headline nowrap' : 'headline';
  return `
  <div class="${slideClasses(data, 't6')}">
    <div class="safe">
      <div class="t6-top">
        ${logoImg('center')}
        ${kicker ? `<div class="kicker">${esc(kicker)}</div>` : ''}
        ${datesLine ? `<div class="dates-line">${esc(datesLine)}</div>` : ''}
        ${locationLine ? `<div class="location-line">${esc(locationLine)}</div>` : ''}
      </div>
      <div class="headline-wrap"><div class="${headlineClass}" data-autofit data-min="${headlineMin || 60}" data-max="${headlineMax || 110}">${formatHeadline(headline)}</div></div>
      <div class="t6-bottom">
        <div class="price-stack">
          ${badge ? `<div class="badge">${esc(badge)}</div>` : ''}
          <div class="price-new" data-autofit data-min="70" data-max="110">${esc(price)}</div>
          ${priceNote ? `<div class="price-note">${esc(priceNote)}</div>` : ''}
        </div>
        ${cta ? `<div class="cta-block">${esc(cta)}</div>` : ''}
        ${footnote ? `<div class="footnote">${esc(footnote)}</div>` : ''}
      </div>
      ${
        ageValue
          ? `<div class="ages-badge">${ageLabel ? `<span>${esc(ageLabel)}</span>` : ''}<span>${esc(ageValue)}</span></div>`
          : ''
      }
    </div>
  </div>`;
}

export const templates = { T1: t1, T2: t2, T3: t3, T4: t4, T5: t5, T6: t6 };
