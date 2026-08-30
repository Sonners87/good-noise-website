export const SITE_URL = "https://goodnoiseproject.com.au"

function setMetaByName(name: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement("meta")
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

function setMetaByProperty(property: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement("meta")
    meta.setAttribute("property", property)
    document.head.appendChild(meta)
  }
  meta.content = content
}

// Sets document.title the same way every page already does directly, plus
// the <meta name="description"> tag that no page has needed until now —
// creates the tag if index.html doesn't already have one.
export function setPageMeta(title: string, description: string) {
  document.title = title
  setMetaByName("description", description)
}

// Sets (or updates) the canonical link for the current page. Exported on its
// own for pages that only need a self-referencing canonical without the
// rest of the Open Graph/JSON-LD machinery below.
export function setCanonical(path: string) {
  const canonicalUrl = `${SITE_URL}${path}`
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement("link")
    canonical.rel = "canonical"
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl
}

type LandingPageMetaOptions = {
  /** e.g. "/school-holiday-music-camp-perth" — combined with SITE_URL for the canonical link and og:url. */
  canonicalPath: string
  /** Absolute URL. Defaults to the sitewide og-image.png. */
  ogImage?: string
  /** One or more separate JSON-LD payloads — each renders as its own <script type="application/ld+json"> block. */
  structuredData?: Record<string, unknown>[]
}

// Fuller sibling of setPageMeta for standalone SEO landing pages — ones
// meant to be a cold-search entry point rather than just an in-app nav
// destination. Layers a canonical link, Open Graph/Twitter tags and a
// JSON-LD structured-data block on top of the title/description every page
// already sets. Same create-tag-if-missing approach throughout.
export function setLandingPageMeta(
  title: string,
  description: string,
  { canonicalPath, ogImage = `${SITE_URL}/og-image.png`, structuredData }: LandingPageMetaOptions,
) {
  setPageMeta(title, description)
  setCanonical(canonicalPath)
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  setMetaByProperty("og:type", "website")
  setMetaByProperty("og:site_name", "Good Noise Project")
  setMetaByProperty("og:title", title)
  setMetaByProperty("og:description", description)
  setMetaByProperty("og:url", canonicalUrl)
  setMetaByProperty("og:image", ogImage)
  setMetaByName("twitter:card", "summary_large_image")
  setMetaByName("twitter:title", title)
  setMetaByName("twitter:description", description)
  setMetaByName("twitter:image", ogImage)

  // Clear out any JSON-LD left by a previous call (e.g. this component
  // unmounting/remounting) before writing the current set, so blocks never
  // pile up or leak onto a different page during client-side navigation.
  document
    .querySelectorAll('script[data-page-structured-data="true"]')
    .forEach((node) => node.remove())

  structuredData?.forEach((payload) => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.setAttribute("data-page-structured-data", "true")
    script.textContent = JSON.stringify(payload)
    document.head.appendChild(script)
  })
}
