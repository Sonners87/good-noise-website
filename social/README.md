# Good Noise — Instagram post generator

Renders HTML/CSS slide templates to Instagram-ready PNG and PDF assets
using Playwright. Everything here is driven by the live site's design
tokens (`src/styles/gn-tokens.css`, mirrored into `social/src/tokens.css`)
so the posts stay on-brand without hand-tuning colours or type per slide.

## Adding a new post

1. Copy an existing file in `content/` (e.g. `post-08.json`) to
   `content/post-09.json` and change `id`, `name`, and `slides`.
2. Each slide is one of the five templates (`T1`–`T5`, see below). Only
   the fields that template uses are read — extra fields are ignored.
3. If a slide uses `T4` (image), drop a photo into `assets/images/` named
   to match the slide's `image` slot (see **Images** below).
4. Run the build:

   ```
   npm run build                # renders every post-*.json in content/
   npm run build -- --post=09   # renders just post-09
   ```

No template code changes are needed to add a post — everything is data.

## Output

```
social/output/post-04/
  post-04-slide-01.png   # 2160×2700 (2x), Instagram-ready
  post-04-slide-01.pdf   # 1080×1350pt, live vector text
  ...
  post-04-all.pdf        # every slide of the post, in order, one file
```

`social/output/` is gitignored — it's rebuilt from `content/` on demand
and isn't meant to be committed.

## Templates

All five templates accept a `ground` of `"ink"` (youth-facing, dark),
`"blue"` (parent-facing, `#6FD3FF`), or `"orange"` (announcements,
`#FF4A00`). Ground sets the background, text colour, and eyebrow/accent
colour together — see `.ground-*` in `src/tokens.css`.

Canvas is 1080×1350 (4:5). All templates keep content inside a 96px safe
margin and clear of the logo lockup (reserved bottom ~230px of the
canvas). Headlines (and the T5 price) auto-fit: the renderer shrinks the
font in 4px steps until the text stops overflowing its box, down to a
per-template floor — see `data-autofit` in `build.mjs`.

- **T1 — Statement.** `eyebrow?`, `headline`, `body?`, `cta?`. A single
  big headline with optional supporting copy. Content sits in the upper
  two-thirds of the canvas.
- **T2 — Spec.** `eyebrow?`, `rows: [{ label, value }]`. A details list
  (when/where/who-style) with hairline dividers between rows.
- **T3 — Series.** `number`, `eyebrow`, `headline`. The recurring
  "Trick 01/02/03…" template — a solid number block, series eyebrow, then
  headline. Keep the layout identical week to week; only `number` and
  `headline` should change.
- **T4 — Image.** `image` (a slot id from `assets/images/`), `headline`,
  `sub?`. Full-bleed photo, duotoned to ink + signature blue, with a
  bottom scrim so the headline stays legible.
- **T5 — CTA / Price.** `badge?`, `price`, `oldPrice?` (omit for a flat
  price — no strikethrough renders), `priceNote?` (a small line tucked
  tight under the price, e.g. "for both days"), `cta?`, `footnote?` (a
  literal `\n` in the string breaks it to a second line). Always use
  `ground: "orange"` for this one per the brief — it's the sell/booking
  slide.

Template markup lives in `src/templates.mjs`; layout and type rules live
in `src/base.css`. Neither file should ever contain post copy — that
always comes from `content/*.json`.

### Highlighting a word in a headline

Wrap the word/phrase in `[[double brackets]]` in the JSON `headline`
string, e.g. `"MUSIC'S [[BETTER]] SHARED."`, and it renders as a tilted
accent-colour box behind that text — the same `.gn-hl` device used on the
site's homepage hero. Works in T1, T3, and T4 headlines. Use it once per
headline at most, same rule as the site.

### Palette override for a specific workshop

A slide can carry an optional `"palette": "forest"` alongside its
`ground`. This applies the same forest/burnt override the live site uses
on `/workshops/2026-spring-holidays` (`.gn-workshop-2026`) — forest
replaces ink, burnt orange replaces both the pink-shadow and acid-accent
roles. It repaints badges, shadows, and eyebrows automatically since
everything is already wired through `--gn-ink`/`--gn-pink`/`--gn-acid`.
Only use it on posts promoting that specific workshop (currently
post-04) — everything else stays on the standard ink/blue/orange palette.

## Images

Three slots need real photos: `06-05`, `08-01`, `08-03` (see
`assets/images/MANIFEST.md` for what each shot should be). Until you
supply them, generated placeholders stand in.

To swap a real photo in: drop a file named `<slot-id>.jpg` (`.jpeg` or
`.png` also work) into `assets/images/`, e.g. `assets/images/06-05.jpg`,
then re-run `npm run build`. No code or JSON changes — the build resolves
`.jpg` → `.jpeg` → `.png` in that order and uses whichever exists.

Regenerate blank placeholders any time with:

```
npm run build:placeholders
```

## Fonts

Anton, Work Sans (regular + medium), and Space Mono (regular + bold) are
self-hosted in `assets/fonts/` and loaded via local `@font-face` rules in
`src/tokens.css` — nothing is fetched from Google Fonts at render time.

This matters for the PDFs: they must stay live, editable vector text for
Affinity, not rasterised or outlined type. Chromium's PDF export embeds a
*variable* font's glyphs as a Type 3 (procedural/bitmap) font instead of
proper outlines — which breaks selecting/editing text in Affinity — so
the Work Sans files here are static per-weight instances (400 regular,
500 medium), not the variable font. If you ever swap in a different
weight or face, make sure whatever you add is a static instance, and
verify with `pdffonts some-slide.pdf` that it shows as `CID TrueType`
with `emb: yes`, not `Type 3`.

## Safe zones recap

- **Outer margin:** 96px on every side — no critical type outside it.
- **Logo zone:** reserved for the bottom ~230px of the canvas. The logo
  itself is ~88px tall, centred, with its bottom edge 120px up from the
  canvas bottom edge. Nothing else renders in that zone.
- **Hard edges only:** `border-radius: 0` everywhere, per the site's
  design tokens. No rounded corners, ever.
