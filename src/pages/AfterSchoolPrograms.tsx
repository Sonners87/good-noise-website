import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import FacilitatorContact from "../components/FacilitatorContact"
import Accordion from "../components/afterschool/Accordion"
import ThemesGraphic from "../components/afterschool/ThemesGraphic"
import Placeholder from "../components/afterschool/Placeholder"
import { setLandingPageMeta, SITE_URL } from "../lib/pageMeta"
import {
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
  TESTIMONIALS_PLACEHOLDER,
  whoFor,
} from "../content/afterSchool"
import heroPhoto from "../assets/images/after-school-hero-group.webp"
import eightWeekPhoto from "../assets/images/after-school-eight-week.webp"
import dropInPhoto from "../assets/images/after-school-drop-in.webp"
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
      <section className="bg-ink text-cream">
        <Header />
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:gap-14 md:px-10 md:pb-24 md:pt-16">
          <div>
            <span className="gn-eyebrow text-[var(--gn-acid)]">{hero.eyebrow}</span>
            <h1 className="font-display mt-5 text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-relaxed text-cream">{hero.subhead}</p>
            <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-cream/80 md:text-lg">
              {hero.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PillButton href="/contact" variant="acidOnDark">
                Ask a question
              </PillButton>
              {/* TODO(info-pack): becomes "Download the info pack" once the PDF exists. */}
              <PillButton href={INFO_PACK_HREF} variant="outlineOnDark">
                {INFO_PACK_LABEL}
              </PillButton>
            </div>
          </div>
          <div className="gn-photo-frame">
            <PhotoImage src={heroPhoto} alt={hero.photoAlt} aspect="aspect-[3/2]" objectPosition="center 40%" />
          </div>
        </div>

        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-20">
          <dl className="grid grid-cols-1 border-2 border-cream/40 sm:grid-cols-2 lg:grid-cols-4">
            {hero.glance.map((item) => (
              <div
                key={item.label}
                className="border-b-2 border-cream/40 p-5 last:border-b-0 sm:border-r-2 sm:[&:nth-child(2n)]:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r-2 lg:last:border-r-0"
              >
                <dt className="font-body text-xs font-semibold uppercase tracking-wider text-[var(--gn-pink)]">
                  {item.label}
                </dt>
                <dd className="mt-2 text-base font-semibold leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Outcomes */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <h2 className={h2Class}>{outcomes.heading}</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {outcomes.tiles.map((tile) => (
              <li key={tile.word} className="gn-card-flat">
                <h3 className="font-display text-xl">{tile.word}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80">{tile.line}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-lg font-semibold">{outcomes.footnote}</p>
        </div>
      </section>

      {/* 3. Program options */}
      <section className="bg-ink text-cream" id="programs">
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
                  <h3 className="font-display text-2xl">{card.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-cream/85">{card.oneLiner}</p>
                  <Accordion tone="dark" className="mt-5" summary="See details">
                    {card.id === "eight-week" ? (
                      <div className="space-y-5">
                        <p className="text-base leading-relaxed text-cream/85">
                          Sessions follow three themes: <strong>Permission</strong>, <strong>Play</strong> and{" "}
                          <strong>Connection</strong>.
                        </p>
                        <ThemesGraphic />
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

      {/* 4. Who it's for */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <h2 className={h2Class}>{whoFor.heading}</h2>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {whoFor.items.map((item) => (
              <div key={item.label} className="border-t-2 border-ink pt-4">
                <dt className="font-body text-xs font-semibold uppercase tracking-wider text-ink/60">{item.label}</dt>
                <dd className="mt-2 text-base leading-relaxed md:text-lg">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="bg-ink text-cream">
        <div className={sectionInner}>
          <h2 className={h2Class}>{howItWorks.heading}</h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="border-2 border-cream/40 p-5">
                <span className="font-display text-3xl text-[var(--gn-acid)]">{i + 1}</span>
                <h3 className="font-display mt-2 text-xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/80">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {howItWorks.delivery.map((card) =>
              card.featured ? (
                <div
                  key={card.title}
                  className="border-[3px] border-cream bg-cream p-6 text-ink shadow-[6px_6px_0_0_var(--gn-pink)] md:p-8"
                >
                  <h3 className="font-display text-2xl md:text-3xl">{card.title}</h3>
                  <p className="mt-4 text-base leading-relaxed md:text-lg">{card.text}</p>
                </div>
              ) : (
                <div key={card.title} className="border-2 border-cream/40 p-6 md:p-8">
                  <h3 className="font-display text-2xl md:text-3xl">{card.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-cream/85 md:text-lg">{card.text}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 6. Safety summary */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <h2 className={h2Class}>{safetySummary.heading}</h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {safetySummary.ticks.map((tick) => (
              <li key={tick} className="flex items-start gap-3 border-2 border-ink p-4">
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

      {/* 7. Meet Dave, video, testimonials */}
      <section className="bg-ink text-cream">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className={h2Class}>{meetDave.heading}</h2>
              <PhotoImage
                src={davePhoto}
                alt={meetDave.photoAlt}
                aspect="aspect-[4/3]"
                objectPosition="center 30%"
                className="mt-8"
              />
              <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/85 md:text-lg">{meetDave.text}</p>
              <FacilitatorContact tone="onDark" className="mt-5" />
              <Link to="/about" className="gn-btn-secondary mt-7 text-[13px]">
                {meetDave.linkLabel} &rarr;
              </Link>
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
              <figcaption className="mt-3 text-sm text-cream/70">{meetDave.videoLabel}</figcaption>
            </figure>
          </div>

          {testimonials.length > 0 ? (
            <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.name} className="border-2 border-cream/40 p-6">
                  <blockquote className="text-base leading-relaxed">“{t.quote}”</blockquote>
                  <p className="mt-4 text-sm font-semibold">
                    {t.name}, {t.role}, {t.organisation}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <Placeholder className="mt-14">{TESTIMONIALS_PLACEHOLDER}</Placeholder>
          )}
        </div>
      </section>

      {/* 8. Cost, FAQs, final CTA */}
      <section className="bg-cream text-ink">
        <div className={sectionInner}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className={h2Class}>{cost.heading}</h2>
              <p className="mt-5 text-base leading-relaxed md:text-lg">{cost.text}</p>
            </div>
            <div>
              <h2 className={h2Class}>{faqs.heading}</h2>
              <div className="mt-6 border-b-2 border-ink/20">
                {faqs.items.map((item) => (
                  <Accordion key={item.q} summary={item.q} summaryClassName="text-lg">
                    <p className="max-w-2xl text-base leading-relaxed text-ink/80">{item.a}</p>
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <h2 className={`${h2Class} max-w-3xl`}>{finalCta.heading}</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/85 md:text-lg">{finalCta.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PillButton href="/contact" variant="acidOnDark">
              Ask a question
            </PillButton>
            {/* TODO(info-pack): becomes "Download the info pack" once the PDF exists. */}
            <PillButton href={INFO_PACK_HREF} variant="outlineOnDark">
              {INFO_PACK_LABEL}
            </PillButton>
          </div>
          <FacilitatorContact tone="onDark" className="mt-8" />
        </div>
      </section>

      <Footer />
    </>
  )
}
