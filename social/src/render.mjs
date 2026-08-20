import { templates } from './templates.mjs';

// Builds the full standalone HTML document for one slide. The returned
// HTML is written to a scratch file inside social/.build-tmp/ so that the
// relative asset paths in tokens.css / templates.mjs resolve correctly
// when Playwright navigates to it with page.goto(file://...).
export function renderSlideHtml(slideData) {
  const fn = templates[slideData.template];
  if (!fn) {
    throw new Error(`Unknown template "${slideData.template}"`);
  }
  const body = fn(slideData);

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="stylesheet" href="../src/tokens.css" />
<link rel="stylesheet" href="../src/base.css" />
</head>
<body>
${body}
</body>
</html>`;
}
