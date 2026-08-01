import { useEffect } from "react"
import { useLocation, useNavigationType } from "react-router-dom"

// Module-level so it survives across navigations for the life of the tab.
const scrollPositions = new Map<string, number>()

// React Router's client-side navigation doesn't manage scroll position the
// way a real page load does. Two problems, two fixes:
//   1. Clicking a Link while scrolled down carries that scroll offset onto
//      the new route — most noticeable on mobile, where the nav menu is
//      reachable from anywhere on a long page. Fix: scroll to top on
//      forward navigation (PUSH/REPLACE).
//   2. The browser's native scroll restoration on back/forward (POP) isn't
//      reliable for pushState-based SPA routes — it can't restore a scroll
//      position on content that hasn't re-rendered yet. Fix: track scroll
//      position per history entry ourselves and restore it manually on POP.
//
// Both calls use `behavior: "instant"` to override the site's global
// `scroll-behavior: smooth` (index.css, for in-page hash-anchor jumps) —
// without it, every route change visibly animates the scroll reset/restore
// over ~1s, which reads as broken rather than like a normal page change.
export default function ScrollToTop() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(location.key, window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [location.key])

  useEffect(() => {
    const top = navigationType === "POP" ? (scrollPositions.get(location.key) ?? 0) : 0
    window.scrollTo({ top, behavior: "instant" })
  }, [location.key, navigationType])

  return null
}
