import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// React Router's client-side navigation doesn't reset scroll position like a
// real page load does, so clicking a Link while scrolled down a page lands
// on the new route at that same scroll offset — most noticeable on mobile,
// where the nav menu is reachable from anywhere on a long page.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
