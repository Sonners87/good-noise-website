import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Eyebrow from "../components/Eyebrow"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import FounderQuote from "../components/FounderQuote"
import NotFound from "./NotFound"
import { workshops } from "../content/workshops"
import { linkifyEmail } from "../lib/linkifyEmail"
import acousticBoyPhoto from "../assets/images/strip-acoustic-boy.webp"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"
import heroInstrumentsOverlay from "../assets/images/hero-instruments-overlay-3.png"

// Per-slug hero imagery. Content data stays plain (no image imports), so
// each new workshop just needs an entry here alongside its content entry.
// PhotoImage always renders these in its portrait (4/5) box with object-cover,
// so any source photo — landscape or portrait — auto-crops to fit without
// needing to pre-crop the file. Use `objectPosition` to steer the crop toward
// the subject if the default center crop cuts off what matters.
const heroImages: Record<string, { src: string; alt: string; objectPosition?: string }> = {
  "songwriting-oct-2026": {
    src: bandPracticePhoto,
    alt: "Two young musicians at band practice, one playing electric guitar and singing into a microphone",
  },
  "in-school-songwriting": {
    src: acousticBoyPhoto,
    alt: "A teenage boy playing acoustic guitar on stage",
  },
}

// `slugProp` lets a page mount this component directly against a fixed
// workshop (e.g. the /for-schools route) instead of reading the slug from
// the URL — same rendering, different route.
export default function WorkshopDetail({ slug: slugProp }: { slug?: string } = {}) {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugProp ?? slugParam
  const workshop = slug ? workshops[slug] : undefined
  const showFounderQuote = workshop?.slug === "in-school-songwriting"

  useEffect(() => {
    if (workshop) document.title = workshop.title
  }, [workshop])

  if (!workshop) return <NotFound />

  const heroImage = heroImages[workshop.slug]
  const isSpringHolidays = workshop.slug === "2026-spring-holidays"
  const highlightsColumns =
    workshop.highlights.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"

  return (
    <>
      {/* Intro / info summary */}
      {isSpringHolidays ? (
        <section className="bg-brand">
          <Header />

          {/* Text column left-aligned to match the intro section's copy
              below; table column shifts right, starting slightly right of
              center (60/40 split) rather than the plain halfway point. On
              mobile this collapses to a single column, so the table lands
              directly under the hook line. The instruments/hands photo sits
              behind the text column only, bottom-anchored — its own
              transparent top means it always reads as "rising up" no matter
              how tall this column ends up being. Bottom padding lives on the
              right column rather than the grid container, so the (grid-
              stretched) left column's box — and the image inside it — runs
              flush to the section's actual bottom edge instead of stopping
              short at a shared padding line. */}
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 pt-14 md:grid-cols-[3fr_2fr] md:px-10 md:pt-20">
            <div className="relative overflow-hidden">
              <img
                src={heroInstrumentsOverlay}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-0 w-full opacity-20"
              />

              <div className="relative z-10">
                <Eyebrow tone="onBlue">{workshop.eyebrow ?? "Workshop"}</Eyebrow>
                <h1 className="font-display max-w-2xl text-4xl uppercase leading-[1.05] text-terracotta sm:text-5xl md:text-6xl">
                  {workshop.title}
                </h1>
                <h2 className="font-display mt-3 max-w-xl text-4xl uppercase leading-[0.98] text-white sm:text-5xl">
                  Your Bandmates Are Waiting!
                </h2>
              </div>
            </div>

            <div className="pb-14 md:pb-20">
              <div className="max-w-md">
                <WorkshopInfoCard
                  rows={workshop.infoRows}
                  ctaLabel={workshop.ctaLabel}
                  ctaHref={workshop.ctaHref}
                >
                  <p className="mt-4 text-center font-body font-bold text-base text-terracotta md:text-lg">
                    SPOTS ARE LIMITED
                  </p>
                </WorkshopInfoCard>
              </div>

              {workshop.ageRangeNote && (
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  {linkifyEmail(workshop.ageRangeNote)}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-brand">
          <Header />
          <div
            className={`mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-14 md:px-10 md:py-20 ${
              heroImage ? "md:grid-cols-2" : ""
            }`}
          >
            <div>
              <Eyebrow tone="onBlue">{workshop.eyebrow ?? "Workshop"}</Eyebrow>
              <h1 className="font-display max-w-2xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
                {workshop.title}
              </h1>

              <div className="mt-8 max-w-md">
                <WorkshopInfoCard
                  rows={workshop.infoRows}
                  ctaLabel={workshop.ctaLabel}
                  ctaHref={workshop.ctaHref}
                />
              </div>

              {workshop.ageRangeNote && (
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                  {linkifyEmail(workshop.ageRangeNote)}
                </p>
              )}
            </div>

            {heroImage && (
              <PhotoImage
                src={heroImage.src}
                alt={heroImage.alt}
                objectPosition={heroImage.objectPosition}
              />
            )}
          </div>
        </section>
      )}

      {/* Intro copy */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          {workshop.introHeading && (
            <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
              {workshop.introHeading}
            </h2>
          )}
          <div
            className={`max-w-2xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg ${
              workshop.introHeading ? "mt-8" : ""
            }`}
          >
            {workshop.introParagraphs.map((paragraph, i) => (
              <p
                key={paragraph}
                className={isSpringHolidays && i === 0 ? "font-bold text-ink" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect / What to Bring — general-vibe expectations, shown
          above the day-by-day highlights below. */}
      {(workshop.whatToExpect || workshop.whatToBring) && (
        <section className="bg-cream">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
            {workshop.whatToExpect && (
              <div>
                <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                  What to Expect
                </h2>
                <ul className="mt-8 max-w-2xl space-y-3">
                  {workshop.whatToExpect.map((item) => (
                    <li
                      key={item.bold}
                      className="flex items-start gap-3 border-b border-ink/15 pb-3 font-body text-base leading-relaxed text-ink/80 last:border-b-0 md:text-lg"
                    >
                      <span className="mt-1 text-terracotta" aria-hidden="true">
                        &#9679;
                      </span>
                      <span>
                        <strong className="font-semibold text-ink">{item.bold}</strong>
                        {item.rest}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {workshop.whatToBring && (
              <div>
                <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                  What to Bring
                </h2>
                <ul className="mt-8 max-w-md space-y-3">
                  {workshop.whatToBring.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-ink/15 pb-3 font-body text-base text-ink/80 last:border-b-0 md:text-lg"
                    >
                      <span className="mt-1 text-terracotta" aria-hidden="true">
                        &#9679;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Highlights / schedule */}
      {workshop.highlights.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl md:text-6xl">
              {workshop.highlightsHeading}
            </h2>
            <div className={`mt-10 grid grid-cols-1 gap-6 ${highlightsColumns}`}>
              {workshop.highlights.map((highlight, i) => (
                <div
                  key={`${highlight.title ?? ""}-${i}`}
                  className="border-2 border-ink bg-sage/25 p-6 text-base leading-relaxed text-ink/85 md:text-lg"
                >
                  {highlight.title && (
                    <p className="font-body font-bold mb-2 text-ink">
                      {highlight.title}
                    </p>
                  )}
                  <p>{highlight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing — either a booking-style CTA band or direct-contact details */}
      {workshop.limitedSpotsNote && (
        <section className="bg-brand">
          <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
            {workshop.limitedSpotsHeading && (
              <h2 className="font-display mx-auto max-w-xl text-4xl leading-[0.98] text-white sm:text-5xl">
                {workshop.limitedSpotsHeading}
              </h2>
            )}
            <p
              className={`mx-auto max-w-xl text-base leading-relaxed text-white/90 md:text-lg ${
                workshop.limitedSpotsHeading ? "mt-6" : ""
              }`}
            >
              {workshop.limitedSpotsNote}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <PillButton href={workshop.ctaHref} variant="primary">
                {workshop.ctaLabel}
              </PillButton>
              {workshop.refundShortNote && (
                <span className="font-body font-semibold text-xs text-white/70">
                  {workshop.refundShortNote}
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Secondary CTA, deliberately away from the primary Book button
          above — for people not ready to commit to these dates. */}
      {workshop.slug === "2026-spring-holidays" && (
        <section className="bg-ink">
          <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
            <p className="mx-auto max-w-md text-base leading-relaxed text-white/85 md:text-lg">
              Can't make these dates?
            </p>
            <div className="mt-5">
              <PillButton href="/stay-in-touch" variant="outlineOnDark">
                Get notified about future workshops
              </PillButton>
            </div>
          </div>
        </section>
      )}

      {workshop.directContact && (
        <section className="bg-brand">
          <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
            <p className="mx-auto max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
              {workshop.directContact.prompt}
            </p>
            <div className="mt-6 flex flex-col items-center gap-2 font-body text-base text-white md:text-lg">
              <a
                href={`mailto:${workshop.directContact.email}`}
                className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
              >
                {workshop.directContact.email}
              </a>
              <a
                href={`tel:${workshop.directContact.phone.replace(/\s+/g, "")}`}
                className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
              >
                {workshop.directContact.phone}
              </a>
            </div>
          </div>
        </section>
      )}

      {showFounderQuote && <FounderQuote />}

      {/* Facilitator */}
      <section id="facilitator" className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
          <PhotoImage
            src={facilitatorPhoto}
            alt="Dave Sonntag playing acoustic guitar and singing into a microphone outdoors"
            aspect="aspect-[4/5]"
            objectPosition="center 20%"
          />
          <div>
            <h2 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
              {workshop.facilitatorHeading}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
              {workshop.facilitatorBio}{" "}
              <Link
                to={workshop.facilitatorLinkHref}
                className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
              >
                {workshop.facilitatorLinkLabel} &rarr;
              </Link>
            </p>

            <FacilitatorContact className="mt-6" />
          </div>
        </div>
      </section>

      {/* Prerequisites, scholarship, refund policy — each renders only if present */}
      {(workshop.prerequisites ||
        workshop.scholarshipNote ||
        workshop.refundPolicy) && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            {workshop.prerequisites && (
              <p className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                {workshop.prerequisites}
              </p>
            )}

            {workshop.scholarshipNote && (
              <div className="mt-8 max-w-2xl border-2 border-terracotta bg-terracotta/10 p-6">
                <p className="text-sm italic leading-relaxed text-ink/85 md:text-base">
                  {linkifyEmail(workshop.scholarshipNote)}
                </p>
              </div>
            )}

            {workshop.refundPolicy && (
              <div className="mt-8 max-w-md">
                <WorkshopInfoCard
                  title="Cancellations & Refunds"
                  rows={workshop.refundPolicy}
                />
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </>
  )
}
