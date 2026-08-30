// Post-build static-HTML snapshot. Runs after `vite build`: boots a local
// static server against dist/, visits every real route in a headless
// Chromium tab, waits for React to render + the per-page useEffect meta/
// JSON-LD to run, then writes the fully-resolved DOM to
// dist/<route>/index.html. Netlify serves these as physical files ahead of
// the SPA `/* -> /index.html` fallback in _redirects, so each route gets
// real static HTML (title, meta tags, body copy, JSON-LD) for crawlers,
// while the client-rendered app still boots normally on top for real users.
//
// Chosen over vite-react-ssg / @prerenderer's puppeteer renderer because it
// needs zero changes to App.tsx's routing or main.tsx's render call, and
// `playwright` (used here) is already a project devDependency.
import { chromium } from "playwright"
import { createServer } from "node:http"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, "..", "dist")
const PORT = 4173

// Every real, indexable route. Excludes: the wildcard 404, /admin/* (internal
// tool, not for search), and routes gated off by SHOW_OCT_2026_CAMP (they
// 404 client-side while disabled, so there's nothing meaningful to snapshot).
const ROUTES = [
  "/",
  "/workshops",
  "/workshops/2026-spring-holidays",
  "/for-schools",
  "/book-2026-spring-holidays",
  "/school-holiday-music-camp-perth",
  "/booking-confirmed-2026-spring",
  "/for-parents",
  "/stay-in-touch",
  "/about",
  "/contact",
  "/child-safety-policy",
  "/photography-policy",
  "/privacy",
]

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".webmanifest": "application/manifest+json",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
}

function startServer() {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0])
    let filePath = path.join(distDir, urlPath)

    if (urlPath === "/" || !path.extname(urlPath)) {
      // SPA fallback: any extensionless path (a route, not an asset) gets
      // dist/index.html — same behaviour as Netlify's `/* -> /index.html`.
      filePath = path.join(distDir, "index.html")
    }

    try {
      const data = await readFile(filePath)
      const ext = path.extname(filePath)
      res.writeHead(200, { "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream" })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end("Not found")
    }
  })

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server))
  })
}

async function main() {
  if (!existsSync(distDir)) {
    throw new Error("dist/ not found — run `vite build` before prerendering.")
  }

  const server = await startServer()
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage()

    for (const route of ROUTES) {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" })
      // Let mount-time useEffects (meta tags, JSON-LD, canonical) run.
      await page.waitForTimeout(150)

      const html = await page.content()
      const outPath =
        route === "/"
          ? path.join(distDir, "index.html")
          : path.join(distDir, route.replace(/^\//, ""), "index.html")

      await mkdir(path.dirname(outPath), { recursive: true })
      await writeFile(outPath, `<!doctype html>\n${html}`)
      console.log(`prerendered ${route} -> ${path.relative(distDir, outPath)}`)
    }

    await page.close()
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
