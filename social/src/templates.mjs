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
  const { eyebrow, headline, headlineMin, headlineMax, body, cta, ctaMeta, heroLogo } = data;
  const classes = heroLogo ? slideClasses(data, 't1') + ' hero-logo' : slideClasses(data, 't1');
  return `
  <div class="${classes}">
    <div class="safe">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="copy-block">
        <div class="headline-wrap"><div class="headline" data-autofit data-min="${headlineMin || 88}" data-max="${headlineMax || 140}">${formatHeadline(headline)}</div></div>
        ${body ? `<div class="body-text">${esc(body)}</div>` : ''}
      </div>
      ${
        cta || ctaMeta
          ? `<div class="cta-group">${ctaMeta ? `<div class="cta-meta">${esc(ctaMeta)}</div>` : ''}${cta ? `<div class="cta-line">${esc(cta)}</div>` : ''}</div>`
          : ''
      }
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

// T7 — FILL METER. A capacity/progress poster: one enormous stat, a solid
// fill bar showing how much of the group is gone, then the usual body +
// CTA. Built for "we're X% full" style announcements, where the bar does
// the work at a glance on the grid. `fillPercent` drives the bar width.
export function t7(data) {
  const { eyebrow, stat, statLabel, statHighlight, fillPercent, meterNote, body, ctaMeta, cta } = data;
  const pct = Math.max(0, Math.min(100, Number(fillPercent) || 0));
  // Omit fillPercent entirely for a stat-only cut (no bar). statHighlight
  // puts the stat in the tilted .hl slab instead — same device as the site's
  // headline highlight, scaled up to poster size.
  const hasMeter = fillPercent !== null && fillPercent !== undefined;
  const statInner = statHighlight ? `<span class="hl">${esc(stat)}</span>` : esc(stat);
  return `
  <div class="${slideClasses(data, 't7')}">
    <div class="safe">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ''}
      <div class="meter-block">
        <div class="stat${statHighlight ? ' stat-hl' : ''}" data-autofit data-min="180" data-max="320">${statInner}</div>
        ${statLabel ? `<div class="stat-label">${esc(statLabel)}</div>` : ''}
        ${hasMeter ? `<div class="meter"><div class="meter-fill" style="width: ${pct}%"></div></div>` : ''}
        ${meterNote ? `<div class="meter-note">${esc(meterNote)}</div>` : ''}
      </div>
      ${body ? `<div class="body-text">${esc(body)}</div>` : ''}
      ${
        cta || ctaMeta
          ? `<div class="cta-group">${ctaMeta ? `<div class="cta-meta">${esc(ctaMeta)}</div>` : ''}${cta ? `<div class="cta-line">${esc(cta)}</div>` : ''}</div>`
          : ''
      }
    </div>
    ${logoImg('bottom')}
  </div>`;
}

// T8 — DIAGONAL. One oversized line of display type run corner-to-corner
// and deliberately bled off every edge, so it reads as an abstract field
// rather than a headline. Body copy and CTA sit over the top in paper cream
// — the third colour is what keeps them legible across both the letterforms
// and the bare ground behind them.
export function t8(data) {
  const { diagonal, body, ctaMeta, cta } = data;
  return `
  <div class="${slideClasses(data, 't8')}">
    <div class="diag-layer" aria-hidden="true"><div class="diag-text">${esc(diagonal)}</div></div>
    <div class="safe">
      ${body ? `<div class="body-text">${esc(body)}</div>` : ''}
      ${
        cta || ctaMeta
          ? `<div class="cta-group">${ctaMeta ? `<div class="cta-meta">${esc(ctaMeta)}</div>` : ''}${cta ? `<div class="cta-line">${esc(cta)}</div>` : ''}</div>`
          : ''
      }
    </div>
    ${logoImg('bottom')}
  </div>`;
}

// T9 — NOW PLAYING. A Spotify-style player screen used as the message: the
// "track" is the offer, the progress bar is how full the program is. Icons
// are hand-rolled inline SVG (nothing is fetched at render time, same rule
// as the fonts). Deliberately stops below the transport row — no device /
// share / queue / lyrics furniture.
export function t9(data) {
  const {
    context,
    artKicker,
    artStat,
    artStatLabel,
    trackTitle,
    trackArtist,
    fillPercent,
    liked,
  } = data;
  const pct = Math.max(0, Math.min(100, Number(fillPercent) || 0));
  const stroke = 'fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  return `
  <div class="${slideClasses(data, 't9')}">
    <div class="np">
      <div class="np-header">
        <svg class="np-ico" viewBox="0 0 24 24" ${stroke}><path d="M5 9l7 7 7-7"/></svg>
        ${context ? `<div class="np-context">${esc(context)}</div>` : '<div></div>'}
        <svg class="np-ico" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>
      </div>

      <div class="np-art">
        <img class="np-art-logo" src="../../src/assets/logo/good-noise-logo-cream.svg" alt="" />
        <div class="np-art-stat">
          ${artKicker ? `<div class="np-art-kicker">${esc(artKicker)}</div>` : ''}
          <div class="np-art-num"><span class="hl-art">${esc(artStat)}</span></div>
          ${artStatLabel ? `<div class="np-art-label">${esc(artStatLabel)}</div>` : ''}
        </div>
      </div>

      <div class="np-meta">
        <div class="np-meta-text">
          <div class="np-title">${esc(trackTitle)}</div>
          <div class="np-artist">${esc(trackArtist)}</div>
        </div>
        ${
          liked
            ? `<svg class="np-liked" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="currentColor"/><path d="M6.8 12.4l3.4 3.4 7-7.2" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="np-liked-tick"/></svg>`
            : ''
        }
      </div>

      <div class="np-bar">
        <div class="np-track"></div>
        <div class="np-fill" style="width: ${pct}%"></div>
        <div class="np-knob" style="left: ${pct}%"></div>
      </div>
      <div class="np-times"></div>

      <div class="np-controls">
        <svg class="np-ctl" viewBox="0 0 24 24" ${stroke}><path d="M2 7h4l12 12h3"/><path d="M18 16l3 3-3 3"/><path d="M2 19h4l12-12h3"/><path d="M18 4l3 3-3 3"/></svg>
        <svg class="np-ctl" viewBox="0 0 24 24" fill="currentColor"><path d="M4.4 5h2.7v14H4.4z"/><path d="M20 5.6v12.8L9.2 12z"/></svg>
        <div class="np-play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.4v15.2L20 12z"/></svg></div>
        <svg class="np-ctl" viewBox="0 0 24 24" fill="currentColor"><path d="M16.9 5h2.7v14h-2.7z"/><path d="M4 5.6v12.8L14.8 12z"/></svg>
        <svg class="np-ctl" viewBox="0 0 24 24" ${stroke}><path d="M17 2.5l3 3-3 3"/><path d="M3 11.5V10a4.5 4.5 0 014.5-4.5H20"/><path d="M7 21.5l-3-3 3-3"/><path d="M21 12.5V14a4.5 4.5 0 01-4.5 4.5H4"/></svg>
      </div>
    </div>
  </div>`;
}

export const templates = { T1: t1, T2: t2, T3: t3, T4: t4, T5: t5, T6: t6, T7: t7, T8: t8, T9: t9 };
