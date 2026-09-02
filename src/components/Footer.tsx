import { Link } from "react-router-dom"
import logo from "../assets/logo/good-noise-logo.png"
import SubscribeForm from "./SubscribeForm"
import InstagramIcon from "./icons/InstagramIcon"

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-b-2 border-[var(--gn-ink-soft)] px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="font-mono text-[12.5px] tracking-wide text-cream/60">
          Perth, WA
        </span>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link
            to="/contact"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            Contact
          </Link>
          <Link
            to="/workshops"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            Workshops
          </Link>
          <Link
            to="/for-schools"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            For Schools
          </Link>
          <a
            href="https://www.instagram.com/goodnoiseau/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-cream/80 transition hover:text-sage"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
        </nav>
        <span className="font-mono text-[12.5px] tracking-wide text-cream/60">
          Good Noise Project © 2026
        </span>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border-b-2 border-[var(--gn-ink-soft)] px-5 py-6 md:flex-row md:items-start md:gap-8 md:px-10">
        <span className="pt-0.5 font-mono text-[12.5px] tracking-wide text-cream/60">
          Policies
        </span>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-8">
          <Link
            to="/child-safety-policy"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            Child Safety Policy
          </Link>
          <Link
            to="/photography-policy"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            Photography, Filming and Recording Policy
          </Link>
          <Link
            to="/privacy"
            className="font-body font-semibold text-sm text-cream/80 transition hover:text-sage"
          >
            Privacy Collection Notice
          </Link>
        </nav>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 border-b-2 border-[var(--gn-ink-soft)] px-5 py-8 md:px-10">
        <span className="font-mono text-[12.5px] tracking-wide text-cream/60">
          Join the community
        </span>
        <SubscribeForm
          source="footer"
          variant="footer"
          submitLabel="Subscribe"
          className="md:max-w-md"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-10 md:px-10">
        <img src={logo} alt="Good Noise Project" className="h-16 w-auto md:h-20" />
      </div>
    </footer>
  )
}
