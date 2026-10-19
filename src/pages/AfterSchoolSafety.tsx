import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import FacilitatorContact from "../components/FacilitatorContact"
import { setLandingPageMeta } from "../lib/pageMeta"
import { safetyPage } from "../content/afterSchool"

const PAGE_TITLE = "After-School Programs: Safety and Paperwork | Good Noise Project"
const PAGE_DESCRIPTION =
  "Child safety, Working with Children Checks, insurance, consent and referral pathways for Good Noise Project after-school programs."

function Tick() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[var(--gn-acid)]" fill="none" stroke="currentColor" strokeWidth="3.5">
      <path d="M3 12.5l6 6L21 5.5" />
    </svg>
  )
}

const linkClass = "underline decoration-2 underline-offset-4 hover:text-[var(--gn-acid)]"

export default function AfterSchoolSafety() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, {
      canonicalPath: "/after-school-programs/safety",
    })
  }, [])

  return (
    <>
      <section className="bg-ink text-cream">
        <Header />
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
          <Link to="/after-school-programs" className="font-body text-sm font-semibold text-cream/80 hover:text-[var(--gn-acid)]">
            &larr; After-school programs
          </Link>
          <h1 className="font-display mt-6 text-4xl leading-[0.98] sm:text-5xl md:text-6xl">{safetyPage.heading}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">{safetyPage.intro}</p>

          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {safetyPage.ticks.map((tick) => (
              <li key={tick.text} className="flex items-start gap-3 border-2 border-cream/40 p-5">
                <Tick />
                <span className="text-base leading-relaxed">
                  {tick.href ? (
                    <Link to={tick.href} className={linkClass}>
                      {tick.text}
                    </Link>
                  ) : (
                    tick.text
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-2xl text-base font-semibold leading-relaxed">{safetyPage.onRequest}</p>

          <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {safetyPage.links.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className={`font-body text-sm font-semibold ${linkClass}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <PillButton href="/contact" variant="acidOnDark">
              Ask a question
            </PillButton>
          </div>
          <FacilitatorContact tone="onDark" className="mt-8" />
        </div>
      </section>
      <Footer />
    </>
  )
}
