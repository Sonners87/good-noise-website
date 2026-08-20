import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/logo/good-noise-logo.png"
import { upcomingWorkshopSlug } from "../content/workshops"

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

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a href="/#home" className="shrink-0">
          <img src={logo} alt="Good Noise Project" className="h-12 w-auto md:h-16" />
        </a>
        {/* text-white/85 lives on <nav> rather than each link: .gn-nav-link
            sets color:currentColor (unlayered, so it always wins over a
            layered Tailwind text-* utility placed on the link itself) and
            only overrides colour on hover/focus — the base colour has to
            come from inheritance instead. */}
        <nav className="hidden items-center gap-9 text-white/85 md:flex">
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
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to={`/workshops/${upcomingWorkshopSlug}`}
            className="gn-btn-primary text-xs"
          >
            Book Now
          </Link>
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
        <nav className="flex flex-col border-t border-white/20 bg-brand-dark text-white/85 md:hidden">
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
        </nav>
      )}
    </header>
  )
}
