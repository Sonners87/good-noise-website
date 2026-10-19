import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import FacilitatorContact from "../components/FacilitatorContact"
import Accordion from "../components/afterschool/Accordion"
import TestimonialCarousel from "../components/afterschool/TestimonialCarousel"
import { setLandingPageMeta, SITE_URL } from "../lib/pageMeta"
import {
  ASK_HREF,
  INFO_PACK_HREF,
  INFO_PACK_LABEL,
  cost,
  eightWeekSchedule,
  faqs,
  finalCta,
  hero,
  howItWorks,
  meetDave,
  outcomes,
  programs,
  safetySummary,
  testimonials,
  whoFor,
} from "../content/afterSchool"
import heroPhoto from "../assets/images/after-school-drop-in.webp"
import eightWeekPhoto from "../assets/images/after-school-eight-week.webp"
import dropInPhoto from "../assets/images/after-school-hero-group.webp"
import tailoredPhoto from "../assets/images/after-school-tailored.webp"
import davePhoto from "../assets/images/after-school-meet-dave.webp"

const cardPhotos: Record<string, string> = {
  "eight-week": eightWeekPhoto,
  "drop-in": dropInPhoto,
  tailored: tailoredPhoto,
}

const PAGE_TITLE = "After-School Music Programs in Perth for Councils and Schools | Good Noise Project"
const PAGE_DESCRIPTION =
  "Weekly songwriting, jamming and recording programs for young people aged 11 to 18. We travel to your venue anywhere in Perth and run every session, or run it with your staff."

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "After-school music programs",
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/after-school-programs`,
    provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Good Noise Project" },
    areaServed: { "@type": "City", name: "Perth" },
    audience: { "@type": "PeopleAudience", suggestedMinAge: 11, suggestedMaxAge: 18 },
  },
]

const jumpLinks = [
  { label: "Who it's for", href: "#whos-it-for" },
  { label: "What young people walk away with", href: "#outcomes" },
  { label: "Formats", href: "#programs" },
  { label: "Get onboard", href: "#get-onboard" },
  { label: "The facilitator", href: "#facilitator" },
  { label: "Cost + FAQs", href: "#cost-faqs" },
]

const sectionInner = "mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24"
const h2Class = "font-display text-3xl leading-[1.02] sm:text-4xl md:text-5xl"

function Tick({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-6 w-6 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="3.5">
      <path d="M3 12.5l6 6L21 5.5" />
    </svg>
  )
}

export default function AfterSchoolPrograms() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, {
      canonicalPath: "/after-school-programs",
      structuredData,
    })
  }, [])

  return (
    <>
      {/* 1. Hero */}
      <section className="bg-[var(--gn-pink)] text-ink">
        <Header tone="onLight" />
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 pb-12 pt-8 md:grid-cols-2 md:gap-14 md:px-10 md:pb-14 md:pt-12">
          <div>
            <span className="gn-eyebrow text-ink">{hero.eyebrow}</span>
            <h1 className="font-display mt-5 text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
              {hero.headline}
            </h1>
            <p className="font-body mt-7 text-sm font-semibold uppercase tracking-wider">{hero.audience}</p>
            <p className="mt-7 max-w-xl text-lg font-semibold leading-relaxed">{hero.body}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PillButton href={ASK_HREF} variant="onLight">
                Ask a question
              </PillButton>
              {/* TODO(info-pack): becomes "Download the info pack" once the PDF exists. */}
              <PillButton href={INFO_PACK_HREF} variant="outline">
                {INFO_PACK_LABEL}
              </PillButton>
            </div>
          </div>
          <div className="gn-photo-frame" style={{ boxShadow: "6px 6px 0 0 var(--gn-ink)" }}>
            <PhotoImage src={heroPhoto} alt={hero.photoAlt} aspect="aspect-[3/2]" objectPosition="center 35%" />
          </div>
        </div>

        <nav aria-label="Jump to a section" className="mx-auto max-w-[1400px] px-5 pb-10 md:px-10 md:pb-14">
          <p className="font-body text-center text-xs font-semibold uppercase tracking-wider text-ink/70">Jump to</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {jumpLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-body inline-block border-2 border-ink px-4 py-2 text-sm font-semibold transition hover:bg-ink hover:text-[var(--gn-pink)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* 2. Intro, who it's for, outcomes + video */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-14">
            <p className="text-xl font-semibold leading-snug md:text-2xl">{hero.subhead}</p>
            <div className="space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
              {hero.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <div id="whos-it-for" className="mt-14 scroll-mt-6">
            <h2 className={h2Class}>{whoFor.heading}</h2>
            <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {whoFor.items.map((item) => (
                <div key={item.label} className="border-t-2 border-ink pt-4">
                  <dt className="font-body text-xs font-semibold uppercase tracking-wider text-ink/60">{item.label}</dt>
                  <dd className="mt-2 text-base leading-relaxed md:text-lg">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div id="outcomes" className="mt-20 grid scroll-mt-6 grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className={h2Class}>{outcomes.heading}</h2>
              <div className="mt-8 border-b-2 border-ink/20">
                {outcomes.tiles.map((tile) => (
                  <Accordion key={tile.word} summary={tile.word} summaryClassName="font-display text-2xl">
                    <p className="max-w-md text-base leading-relaxed text-ink/80">{tile.line}</p>
                  </Accordion>
                ))}
              </div>
              <p className="mt-8 text-lg font-semibold">{outcomes.footnote}</p>
            </div>
            <figure className="mx-auto w-full max-w-[360px]">
              <video
                controls
                playsInline
                preload="none"
                poster="/video/after-school-reel-poster.jpg"
                aria-label={meetDave.videoLabel}
                className="aspect-[9/16] w-full bg-black"
              >
                <source src="/video/after-school-reel.mp4" type="video/mp4" />
              </video>
              <figcaption className="mt-3 text-sm text-ink/70">{meetDave.videoLabel}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* 3. Program options */}
      <section className="bg-ink text-cream scroll-mt-6" id="programs">
        <div className={sectionInner}>
          <h2 className={h2Class}>{programs.heading}</h2>
          <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            {programs.cards.map((card) => (
              <article key={card.id} className="border-[3px] border-cream bg-ink">
                <PhotoImage
                  src={cardPhotos[card.id]}
                  alt={card.photoAlt}
                  aspect="aspect-[4/3]"
                  objectPosition={card.photoPosition}
                />
                <div className="p-5 md:p-6">
                  {/* All three title + one-liner blocks share one grid cell, so every
                      card's collapsed text area is as tall as the longest one at any
                      width. Expanding a card then only grows that card. */}
                  <div className="grid">
                    {programs.cards.map((c) => {
                      const own = c.id === card.id
                      return (
                        <div
                          key={c.id}
                          className={`col-start-1 row-start-1 ${own ? "" : "invisible"}`}
                          aria-hidden={own ? undefined : true}
                        >
                          {own ? (
                            <h3 className="font-display text-2xl">{c.title}</h3>
                          ) : (
                            <p className="font-display text-2xl">{c.title}</p>
                          )}
                          <p className="mt-3 text-base leading-relaxed text-cream/85">{c.oneLiner}</p>
                        </div>
                      )
                    })}
                  </div>
                  <Accordion tone="dark" className="mt-5" summary="See details">
                    {card.id === "eight-week" ? (
                      <div className="space-y-5">
                        <p className="text-base leading-relaxed text-cream/85">
                          Sessions follow three themes: <strong>Permission</strong>, <strong>Play</strong> and{" "}
                          <strong>Connection</strong>.
                        </p>
                                        <ol className="space-y-3">
                          {eightWeekSchedule.map((row) => (
                            <li key={row.week} className="border-t border-cream/20 pt-3 text-sm leading-relaxed">
                              <p className="font-semibold text-[var(--gn-pink)]">
                                Week {row.week} · {row.theme}
                              </p>
                              <p className="mt-1 text-cream/85">{row.what}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <div className="space-y-4 text-base leading-relaxed text-cream/85">
                        {card.details?.map((p) => (
                          <p key={p}>{p}</p>
                        ))}
                      </div>
                    )}
                  </Accordion>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section id="get-onboard" className="scroll-mt-6 bg-cream text-ink">
        <div className={sectionInner}>
          <h2 className={h2Class}>{howItWorks.heading}</h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="border-2 border-ink p-5">
                <span className="font-display text-3xl text-[var(--gn-acid)]">{i + 1}</span>
                <h3 className="font-display mt-2 text-2xl md:text-3xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {howItWorks.delivery.map((card) => (
              <div
                key={card.title}
                className="border-[3px] border-ink bg-cream p-6 text-ink md:p-8"
                style={{
                  boxShadow: `6px 6px 0 0 ${card.shadow === "orange" ? "var(--gn-acid)" : "var(--gn-pink)"}`,
                }}
              >
                <h3 className="font-display text-xl md:text-2xl">{card.title}</h3>
                <p className="mt-4 text-base leading-relaxed md:text-lg">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Safety summary */}
      <section className="bg-ink text-cream">
        <div className={sectionInner}>
          <h2 className={h2Class}>{safetySummary.heading}</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {safetySummary.ticks.map((tick) => (
              <li key={tick} className="flex items-start gap-3 border-2 border-cream/40 p-4">
                <Tick className="mt-0.5 text-[var(--gn-acid)]" />
                <span className="text-base leading-relaxed">{tick}</span>
              </li>
            ))}
          </ul>
          <Link to={safetySummary.linkHref} className="gn-btn-secondary mt-8 text-[13px]">
            {safetySummary.linkLabel} &rarr;
          </Link>
        </div>
      </section>

      {/* 7. Meet Dave, testimonials */}
      <section id="facilitator" className="scroll-mt-6 bg-cream text-ink">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className={h2Class}>{meetDave.heading}</h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/85 md:text-lg">{meetDave.text}</p>
              <FacilitatorContact className="mt-5" />
              <Link to="/about" className="gn-btn-secondary mt-7 text-[13px]">
                {meetDave.linkLabel} &rarr;
              </Link>
            </div>
            <PhotoImage src={davePhoto} alt={meetDave.photoAlt} aspect="aspect-[4/3]" objectPosition="center 30%" />
          </div>

          {testimonials.length > 0 && (
            <div className="mt-16 border-t-2 border-ink pt-12 md:mt-20 md:pt-16">
              <TestimonialCarousel items={testimonials} />
            </div>
          )}
        </div>
      </section>

      {/* 8. Cost, FAQs, final CTA */}
      <section id="cost-faqs" className="scroll-mt-6 bg-ink text-cream">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className={h2Class}>{cost.heading}</h2>
              <p className="mt-5 text-base leading-relaxed md:text-lg">{cost.text}</p>
            </div>
            <div>
              <h2 className={h2Class}>{faqs.heading}</h2>
              <div className="mt-6 border-b-2 border-cream/30">
                {faqs.items.map((item) => (
                  <Accordion key={item.q} tone="dark" summary={item.q} summaryClassName="text-lg">
                    <p className="max-w-2xl text-base leading-relaxed text-cream/80">{item.a}</p>
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--gn-pink)] text-ink">
        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-16 text-center md:px-10 md:pb-36 md:pt-24">
          <h2 className={`${h2Class} mx-auto max-w-3xl`}>{finalCta.heading}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg">{finalCta.text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <PillButton href={ASK_HREF} variant="onLight">
              Ask a question
            </PillButton>
            {/* TODO(info-pack): becomes "Download the info pack" once the PDF exists. */}
            <PillButton href={INFO_PACK_HREF} variant="outline">
              {INFO_PACK_LABEL}
            </PillButton>
          </div>
          <FacilitatorContact className="mt-8 items-center text-ink/80" />
        </div>
      </section>

      <Footer />
    </>
  )
}
