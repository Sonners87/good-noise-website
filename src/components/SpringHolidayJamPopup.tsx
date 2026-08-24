import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

// Shown once per browser tab session. sessionStorage (not localStorage) so a
// visitor who closes the tab and comes back later — or opens the site fresh
// tomorrow — sees it again; it only needs to stay quiet for the rest of the
// current visit once dismissed.
const DISMISSED_KEY = "gn-spring-holiday-popup-dismissed"

// Fires once, after the visitor has scrolled roughly one viewport height —
// a plain scroll listener rather than an IntersectionObserver marker so this
// component is fully self-contained and doesn't require adding a sentinel
// element into each page's markup. `hasFired` guards against the listener
// running again on subsequent scroll events before React unmounts it.
export default function SpringHolidayJamPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const hasFired = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(DISMISSED_KEY)) return

    const handleScroll = () => {
      if (hasFired.current) return
      if (window.scrollY < window.innerHeight * 0.9) return
      hasFired.current = true
      setIsOpen(true)
      window.removeEventListener("scroll", handleScroll)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  function close() {
    sessionStorage.setItem(DISMISSED_KEY, "1")
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
      onClick={close}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="spring-holiday-popup-heading"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="gn-workshop-2026 relative w-full max-w-lg border-2 border-[var(--gn-paper)] bg-ink p-10 text-center shadow-[6px_6px_0_0_var(--gn-pink)] md:p-14"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center border-2 border-[var(--gn-paper)] text-[var(--gn-paper)] transition hover:border-terracotta hover:text-terracotta"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        {/* Same headline treatment as the workshop landing page's hero
            (WorkshopDetail.tsx): white font-display, .gn-hl's tilted orange
            block behind "Bandmates". Sized down from that page's full-width
            hero scale (up to 5.5rem) to fit this modal's panel; text-4xl/
            2.7rem is exactly 20% up from the previous text-3xl/4xl pass. */}
        <h2
          id="spring-holiday-popup-heading"
          className="font-display text-4xl leading-[0.98] text-white sm:text-[2.7rem]"
        >
          Your <span className="gn-hl">Bandmates</span>
          <br />
          Are Waiting!
        </h2>

        {/* Aptos per request — outside the site's locked 3-typeface token
            system (Anton/Work Sans/Space Mono), so no font-display class
            here. Aptos ships with Windows 11/Office; there's no licensed
            file to embed, so visitors without it installed (most non-Windows
            browsers) fall back to the system sans-serif stack below. */}
        <p
          style={{ fontFamily: "'Aptos', 'Segoe UI', system-ui, -apple-system, sans-serif" }}
          className="mt-4 text-[1.3rem] font-semibold tracking-wide text-terracotta uppercase md:text-[1.44rem]"
        >
          2026 Spring Holiday Jam Program
        </p>

        <div className="mt-7 flex flex-col items-center gap-2 font-mono text-sm tracking-wide text-[var(--gn-paper)] uppercase">
          <span>Wed 30 Sep – Thu 1 Oct 2026</span>
          <span>North Perth</span>
          <span>Ages 14–17</span>
        </div>

        <div className="mt-7 border-2 border-terracotta px-6 py-5">
          <span className="font-mono text-xs font-bold tracking-[0.12em] text-terracotta uppercase">
            Foundation Price
          </span>
          <div className="mt-2 flex flex-col items-center gap-1">
            <span className="font-display text-4xl text-[var(--gn-paper)]">$80</span>
            <span className="font-body text-sm text-[var(--gn-paper)]/70">for both days</span>
          </div>
        </div>

        <div className="mt-7 text-sm leading-relaxed text-[var(--gn-paper)]/80">
          <p className="font-bold">Limited spots.</p>
          <p>Cost a barrier? Ask about a no-questions-asked scholarship place.</p>
        </div>

        <Link
          to="/workshops/2026-spring-holidays"
          onClick={close}
          className="gn-btn-hero gn-btn-primary mt-9 flex w-full items-center justify-center text-center text-sm"
        >
          See Workshop Details &rarr;
        </Link>
      </div>
    </div>
  )
}
