const SITE_URL = "https://goodnoiseproject.com.au"

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

type LandingPageMetaOptions = {
  /** e.g. "/school-holiday-music-camp-perth" — combined with SITE_URL for the canonical link and og:url. */
  canonicalPath: string
  /** Absolute URL. Defaults to the sitewide og-image.png. */
  ogImage?: string
  /** JSON-LD payload(s) — usually a `@graph` object bundling Event/FAQPage/etc. */
  structuredData?: Record<string, unknown>
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

  const canonicalUrl = `${SITE_URL}${canonicalPath}`
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement("link")
    canonical.rel = "canonical"
    document.head.appendChild(canonical)
  }
  canonical.href = canonicalUrl

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

  if (structuredData) {
    let script = document.querySelector<HTMLScriptElement>(
      'script[data-page-structured-data="true"]',
    )
    if (!script) {
      script = document.createElement("script")
      script.type = "application/ld+json"
      script.setAttribute("data-page-structured-data", "true")
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData)
  }
}
