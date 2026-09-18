import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/logo/good-noise-logo.png"
import logoBlack from "../assets/logo/good-noise-logo-black.svg"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"
import InstagramIcon from "./icons/InstagramIcon"

const instagramUrl = "https://www.instagram.com/goodnoiseau/"

// "Home" is a same-page hash anchor (scrolls to id="home" on the homepage),
// so it stays a plain <a> — the rest are real routes and use Link.
const links = [
  { label: "Home", href: "/#home" },
  { label: "Workshops", href: "/workshops" },
  { label: "For Parents", href: "/for-parents" },
  { label: "For Schools", href: "/for-schools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

// Every page put the nav on an ink/forest section until the participant
// workshop pages moved to an --gn-acid hero. White nav links and a cream
// wordmark don't survive that background (and .gn-nav-link's acid hover is
// invisible on it), so "onAcid" swaps the whole strip to the ink/paper pair
// — the only one that clears AA against #FF4A00 at nav text size.
export type HeaderTone = "onDark" | "onAcid"

export default function Header({ tone = "onDark" }: { tone?: HeaderTone } = {}) {
  const [open, setOpen] = useState(false)
  const onAcid = tone === "onAcid"

  // Label and destination both follow the upcoming workshop's own state, so
  // pointing `upcomingWorkshopSlug` at the next program is the only edit
  // needed here. While a program is full the button is a mailing-list ask
  // rather than a program link, so it goes to /stay-in-touch — the waitlist
  // form on the workshop page itself stays put for anyone who wants those
  // specific dates.
  const upcoming = workshops[upcomingWorkshopSlug]
  const ctaLabel = upcoming.soldOut
    ? "Join Waitlist"
    : upcoming.registerInterest
      ? "Register Interest"
      : "Book Now"
  const ctaHref = upcoming.soldOut
    ? "/stay-in-touch"
    : `/workshops/${upcomingWorkshopSlug}`

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a href="/#home" className="shrink-0">
          <img
            src={onAcid ? logoBlack : logo}
            alt="Good Noise Project"
            className="h-12 w-auto md:h-16"
          />
        </a>
        {/* text-white/85 lives on <nav> rather than each link: .gn-nav-link
            sets color:currentColor (unlayered, so it always wins over a
            layered Tailwind text-* utility placed on the link itself) and
            only overrides colour on hover/focus — the base colour has to
            come from inheritance instead. */}
        <nav
          className={`hidden items-center gap-9 md:flex ${
            onAcid ? "gn-nav-on-acid text-ink" : "text-white/85"
          }`}
        >
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                className="gn-nav-link font-body font-semibold text-base"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="gn-nav-link font-body font-semibold text-base"
              >
                {link.label}
              </Link>
            ),
          )}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="gn-nav-link"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to={ctaHref}
            className={`gn-btn-primary text-xs ${onAcid ? "gn-btn-on-acid" : ""}`}
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-12 w-12 flex-col items-center justify-center gap-1.5 border-2 md:hidden ${
              onAcid ? "border-ink" : "border-white"
            }`}
          >
            {/* One bar colour for all three, so the tone swap can't leave a
                half-ink/half-white burger. */}
            <span
              className={`h-0.5 w-6 transition ${onAcid ? "bg-ink" : "bg-white"} ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 transition ${onAcid ? "bg-ink" : "bg-white"} ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 transition ${onAcid ? "bg-ink" : "bg-white"} ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`flex flex-col border-t bg-brand-dark text-white/85 md:hidden ${
            onAcid ? "border-ink/30" : "border-white/20"
          }`}
        >
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="gn-nav-link font-body font-semibold border-b border-white/10 px-5 py-4 text-base last:border-b-0"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className="gn-nav-link font-body font-semibold border-b border-white/10 px-5 py-4 text-base last:border-b-0"
              >
                {link.label}
              </Link>
            ),
          )}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="gn-nav-link flex items-center gap-2 px-5 py-4 text-base"
            onClick={() => setOpen(false)}
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
        </nav>
      )}
    </header>
  )
}
