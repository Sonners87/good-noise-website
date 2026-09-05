import { useEffect, useRef, useState, type FormEvent } from "react"
import { submitNetlifyFormFields } from "../lib/submitNetlifyForm"
import { hasCheckoutStarted } from "../lib/bookingIntent"

// The soft-offer counterpart to the page's "Can't make these dates?" strip:
// same offer, but brought to the visitor at the point they're leaving rather
// than waiting for them to find it. Deliberately a corner/bottom card rather
// than a full-screen modal — a backdrop would block the page underneath,
// which is exactly what this shouldn't do for a low-commitment ask.
//
// Only mounted on the 2026 spring holidays workshop page (WorkshopDetail),
// so it can never appear on /booking-confirmed-2026-spring or the booking
// form page; hasCheckoutStarted() covers the visitor who books and then
// navigates back here.

// localStorage (not sessionStorage, unlike SpringHolidayJamPopup): this is a
// "once per visitor per device" ask, not a "once per visit" one. Someone who
// dismissed it or handed over an email should not be asked again tomorrow.
const DISMISSED_KEY = "gn-workshop-loop-popup-dismissed"
const SUBSCRIBED_KEY = "gn-workshop-loop-popup-subscribed"

// Anchor rendered by WorkshopDetail immediately after the primary booking
// CTA band. Scrolling past it is the mobile trigger — see below.
export const LOOP_POPUP_ANCHOR_ID = "gn-loop-popup-anchor"

const SOURCE = "workshop-2026-spring-holidays-exit-popup"

// Scrolling past the CTA fires the popup only if the visitor is still there
// a moment later, so a fast flick down to the footer doesn't trip it
// mid-gesture.
const SETTLE_MS = 1500

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1"
  } catch {
    // Storage blocked (Safari private browsing et al). Failing to read a
    // suppression flag means the visitor may be asked twice, which is the
    // harmless direction — never suppress the page's own content.
    return false
  }
}

function writeFlag(key: string): void {
  try {
    localStorage.setItem(key, "1")
  } catch {
    // Nothing to record.
  }
}

export default function WorkshopStayInLoopPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const hasFired = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocusedRef = useRef<Element | null>(null)

  // Arm the triggers. Runs once — every suppression check is a one-time
  // read, since none of these flags can flip to "suppressed" while the
  // visitor sits on this page without the popup itself having opened.
  useEffect(() => {
    if (readFlag(DISMISSED_KEY) || readFlag(SUBSCRIBED_KEY)) return
    if (hasCheckoutStarted()) return

    let settleTimer: number | undefined

    const open = () => {
      if (hasFired.current) return
      hasFired.current = true
      lastFocusedRef.current = document.activeElement
      setIsOpen(true)
    }

    // Desktop: classic exit intent — the pointer leaving through the top of
    // the viewport, toward the tab bar / address bar. A null relatedTarget
    // means the pointer left the document rather than moving between two
    // elements inside it.
    const handleMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget) return
      if (event.clientY > 0) return
      open()
    }

    // Mobile: scroll depth past the booking CTA. Observing a real anchor
    // element rather than a hard-coded scroll fraction means the trigger
    // stays tied to that section as the page's copy changes length.
    const anchor = document.getElementById(LOOP_POPUP_ANCHOR_ID)
    const observer = anchor
      ? new IntersectionObserver(
          ([entry]) => {
            // "Scrolled past" = the anchor has left the viewport upward. The
            // observer also fires once on observe(), so a visitor who
            // reloads or deep-links partway down the page is caught too.
            const scrolledPast =
              !entry.isIntersecting && entry.boundingClientRect.top < 0

            if (!scrolledPast) {
              window.clearTimeout(settleTimer)
              settleTimer = undefined
              return
            }

            settleTimer = window.setTimeout(open, SETTLE_MS)
          },
          { threshold: 0 },
        )
      : null

    // Pointer-driven devices get exit intent; everything else (touch, and
    // hybrid devices with no fine pointer) gets the scroll fallback, since
    // there is no "leaving the viewport" gesture to detect there.
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    if (hasFinePointer) {
      document.addEventListener("mouseout", handleMouseOut)
    } else if (anchor && observer) {
      observer.observe(anchor)
    }

    return () => {
      document.removeEventListener("mouseout", handleMouseOut)
      observer?.disconnect()
      window.clearTimeout(settleTimer)
    }
  }, [])

  // Escape closes. Focus moves to the card so keyboard and screen-reader
  // users land on it, but nothing is trapped and the page underneath keeps
  // its scroll — Tab walks straight back out into the page, by design.
  useEffect(() => {
    if (!isOpen) return

    panelRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  function close() {
    setIsOpen(false)
    // Return focus to wherever it was when the popup interrupted, so a
    // keyboard visitor resumes where they left off rather than at the top.
    const previous = lastFocusedRef.current
    if (previous instanceof HTMLElement) previous.focus()
  }

  function dismiss() {
    writeFlag(DISMISSED_KEY)
    close()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError(false)
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const name = String(formData.get("name") ?? "")

    try {
      // Same shared "subscribe" Netlify form every other placement posts to
      // (see SubscribeForm) — `source` is what separates this one in the
      // dashboard. Built from explicit fields rather than reusing
      // SubscribeForm itself because that component's three variants are
      // styled for the coral/blue site palette, and this page is the one-off
      // forest/burnt treatment. The hidden form in index.html already
      // declares source/name/email, so it needs no change.
      await submitNetlifyFormFields({
        "form-name": "subscribe",
        source: SOURCE,
        name,
        email,
      })

      const response = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || undefined }),
      })
      if (!response.ok) throw new Error(`Brevo subscribe failed: ${response.status}`)

      writeFlag(SUBSCRIBED_KEY)
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      // No aria-modal: the rest of the page stays live, scrollable and
      // reachable on purpose, so claiming modality here would be a lie to
      // assistive tech.
      aria-labelledby="workshop-loop-popup-heading"
      tabIndex={-1}
      // .gn-popup-panel suppresses the site-wide :focus-visible ring on this
      // container only — see the rule in index.css for why it can't be a
      // Tailwind utility. Controls inside the panel keep the ring.
      className="gn-workshop-2026 gn-popup-panel gn-popup-enter fixed right-4 bottom-4 left-4 z-50 border-2 border-[var(--gn-paper)] bg-ink p-6 shadow-[6px_6px_0_0_var(--gn-pink)] sm:left-auto sm:bottom-6 sm:right-6 sm:w-[26rem] sm:p-7"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center border-2 border-[var(--gn-paper)] text-[var(--gn-paper)] transition hover:border-terracotta hover:text-terracotta"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {submitted ? (
        <div className="pr-8">
          <h2
            id="workshop-loop-popup-heading"
            className="font-display text-2xl leading-[1.05] text-white"
          >
            You're on the list.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--gn-paper)]/80">
            We'll email you when the next Good Noise workshop is locked in.
            Nothing else in between.
          </p>
          <button
            type="button"
            onClick={close}
            className="font-body mt-5 text-sm font-semibold text-[var(--gn-paper)]/70 underline decoration-2 underline-offset-4 transition hover:text-terracotta"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <span className="gn-eyebrow mr-10 text-[var(--gn-acid)]">
            Can't make these dates?
          </span>

          <h2
            id="workshop-loop-popup-heading"
            className="font-display mt-3 pr-8 text-2xl leading-[1.05] text-white sm:text-[1.75rem]"
          >
            Stay in the Loop
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[var(--gn-paper)]/80">
            Not these dates, or not ready to decide? Leave your email and
            we'll let you know when the next Good Noise workshop comes up.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
            <label className="sr-only" htmlFor="workshop-loop-popup-name">
              Name (optional)
            </label>
            <input
              id="workshop-loop-popup-name"
              type="text"
              name="name"
              autoComplete="given-name"
              placeholder="First name (optional)"
              className="w-full border-2 border-[var(--gn-paper)] bg-[var(--gn-paper)] px-4 py-3 text-ink placeholder:text-ink/50"
            />

            <label className="sr-only" htmlFor="workshop-loop-popup-email">
              Email
            </label>
            <input
              id="workshop-loop-popup-email"
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border-2 border-[var(--gn-paper)] bg-[var(--gn-paper)] px-4 py-3 text-ink placeholder:text-ink/50"
            />

            <button
              type="submit"
              disabled={submitting}
              className="gn-btn-hero gn-btn-primary mt-1 w-full text-center text-sm disabled:opacity-70"
            >
              {submitting ? "Sending…" : "Keep me posted"}
            </button>

            {error && (
              <p className="text-sm font-semibold text-[var(--gn-acid)]">
                Something went wrong — please try again.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  )
}
