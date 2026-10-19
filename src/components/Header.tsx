import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "../assets/logo/good-noise-logo.png"
import logoBlack from "../assets/logo/good-noise-logo-black.svg"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"
import InstagramIcon from "./icons/InstagramIcon"

const instagramUrl = "https://www.instagram.com/goodnoiseau/"

type NavLink = { label: string; href: string }
type NavDropdown = { label: string; items: NavLink[] }

// The logo links home, so there's no separate Home item.
const programsMenu: NavDropdown = {
  label: "Programs",
  items: [
    { label: "School Holiday Programs", href: "/workshops" },
    { label: "After-School Programs", href: "/after-school-programs" },
  ],
}
const leftLinks: NavLink[] = [
  { label: "For Organisations", href: "/after-school-programs" },
  { label: "For Parents", href: "/for-parents" },
]
const aboutMenu: NavDropdown = {
  label: "About",
  items: [
    { label: "Meet Dave", href: "/about" },
    { label: "About the Project", href: "/about-the-project" },
  ],
}
const contactLink: NavLink = { label: "Contact", href: "/contact" }

// Every page put the nav on an ink/forest section until the participant
// workshop pages moved to an --gn-acid hero. White nav links and a cream
// wordmark don't survive that background (and .gn-nav-link's acid hover is
// invisible on it), so "onAcid" swaps the whole strip to the ink/paper pair
// — the only one that clears AA against #FF4A00 at nav text size.
// "onLight" is the same ink-on-light treatment for the light-blue school heroes
// and the paper-coloured parents hero, where the acid nav hover would vanish or
// clash, so links underline instead.
export type HeaderTone = "onDark" | "onAcid" | "onLight"

// Dropdown opens on hover and on keyboard focus. The panel's pt bridges the
// gap so the pointer doesn't leave the hover area.
function Dropdown({ menu, linkClass }: { menu: NavDropdown; linkClass: string }) {
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={`${linkClass} inline-flex items-center gap-1.5`}>
        {menu.label}
        <svg viewBox="0 0 10 6" aria-hidden="true" className="h-2 w-2.5 fill-none stroke-current" strokeWidth="2">
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>
      <div className="invisible absolute left-1/2 top-full z-30 -translate-x-1/2 pt-3 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul className="min-w-[14rem] whitespace-nowrap border-2 border-ink bg-cream py-2 text-ink shadow-[4px_4px_0_0_var(--gn-ink)]">
          {menu.items.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="font-body block px-5 py-2.5 text-base font-semibold hover:bg-ink hover:text-cream focus-visible:bg-ink focus-visible:text-cream"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Header({ tone = "onDark" }: { tone?: HeaderTone } = {}) {
  const [open, setOpen] = useState(false)
  const onAcid = tone !== "onDark"

  // Label and destination both follow the upcoming workshop's own state, so
  // pointing `upcomingWorkshopSlug` at the next program is the only edit
  // needed here. While a program is full the button is a mailing-list ask
  // rather than a program link, so it goes to /stay-in-touch — the waitlist
  // form on the workshop page itself stays put for anyone who wants those
  // specific dates.
  const upcoming = workshops[upcomingWorkshopSlug]
  const ctaLabel = upcoming.soldOut
    ? "Join Mailing List"
    : upcoming.registerInterest
      ? "Register Interest"
      : "Book Now"
  const ctaHref = upcoming.soldOut
    ? "/stay-in-touch"
    : `/workshops/${upcomingWorkshopSlug}`

  const navColour =
    tone === "onLight"
      ? "gn-nav-on-light text-ink"
      : onAcid
        ? "gn-nav-on-acid text-ink"
        : "text-white/85"

  const linkClass = "gn-nav-link font-body font-semibold text-base"
  const mobileLinkClass =
    "gn-nav-link font-body font-semibold border-b border-white/10 px-5 py-4 text-base"
  const bar = onAcid ? "bg-ink" : "bg-white"

  // Desktop (lg and up): links either side of the centred logo, About as a
  // dropdown, and the CTA on its own in the far right corner. Below xl: menu
  // button, centred logo, CTA. text-white/85 lives on the <nav> rather than
  // each link: .gn-nav-link sets color:currentColor (unlayered, so it beats a
  // layered Tailwind text-* utility on the link itself) and only overrides
  // colour on hover/focus.
  return (
    <header className="relative z-20">
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-5 md:px-10">
        <div className="flex items-center justify-start xl:justify-end">
          <nav className={`hidden items-center gap-8 xl:flex xl:pr-10 ${navColour}`}>
            <Dropdown menu={programsMenu} linkClass={linkClass} />
            {leftLinks.map((link) => (
              <Link key={link.label} to={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 border-2 xl:hidden ${
              onAcid ? "border-ink" : "border-white"
            }`}
          >
            {/* One bar colour for all three, so the tone swap can't leave a
                half-ink/half-white burger. */}
            <span className={`h-0.5 w-6 transition ${bar} ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 transition ${bar} ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 transition ${bar} ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>

        <a href="/#home" className="justify-self-center">
          <img
            src={onAcid ? logoBlack : logo}
            alt="Good Noise Project"
            className="h-11 w-auto md:h-16"
          />
        </a>

        <div className="flex items-center justify-end xl:justify-start">
          <nav className={`hidden items-center gap-8 xl:flex xl:pl-10 ${navColour}`}>
            <Dropdown menu={aboutMenu} linkClass={linkClass} />
            <Link to={contactLink.href} className={linkClass}>
              {contactLink.label}
            </Link>
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
          <Link
            to={ctaHref}
            className={`gn-btn-primary px-3! py-2.5! text-[10px] md:px-6! md:py-[13px]! md:text-xs xl:absolute xl:right-10 xl:top-1/2 xl:-translate-y-1/2 ${onAcid ? "gn-btn-on-acid" : ""}`}
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {open && (
        <nav
          className={`flex flex-col border-t bg-brand-dark text-white/85 xl:hidden ${
            onAcid ? "border-ink/30" : "border-white/20"
          }`}
        >
          {programsMenu.items.map((link) => (
            <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className={mobileLinkClass}>
              Programs: {link.label}
            </Link>
          ))}
          {leftLinks.map((link) => (
            <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className={mobileLinkClass}>
              {link.label}
            </Link>
          ))}
          {aboutMenu.items.map((link) => (
            <Link key={link.label} to={link.href} onClick={() => setOpen(false)} className={mobileLinkClass}>
              About: {link.label}
            </Link>
          ))}
          <Link to={contactLink.href} onClick={() => setOpen(false)} className={mobileLinkClass}>
            {contactLink.label}
          </Link>
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
