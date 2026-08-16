import { useState } from "react"
import { Link } from "react-router-dom"
import PillButton from "./PillButton"
import logo from "../assets/logo/good-noise-logo.png"
import { upcomingWorkshopSlug } from "../content/workshops"

// "Home" is a same-page hash anchor (scrolls to id="home" on the homepage),
// so it stays a plain <a> — the rest are real routes and use Link.
const links = [
  { label: "Home", href: "/#home" },
  { label: "Workshops", href: "/workshops" },
  { label: "For Schools", href: "/for-schools" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a href="/#home" className="shrink-0">
          <img src={logo} alt="Good Noise" className="h-12 w-auto md:h-16" />
        </a>
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                className="font-body font-semibold text-base text-white/85 transition hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="font-body font-semibold text-base text-white/85 transition hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <PillButton
            href={`/workshops/${upcomingWorkshopSlug}`}
            variant="primary"
            size="sm"
          >
            Book Now
          </PillButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-12 w-12 flex-col items-center justify-center gap-1.5 border-2 border-white md:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-white/20 bg-brand-dark md:hidden">
          {links.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body font-semibold border-b border-white/10 px-5 py-4 text-base text-white/85 last:border-b-0"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className="font-body font-semibold border-b border-white/10 px-5 py-4 text-base text-white/85 last:border-b-0"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  )
}
