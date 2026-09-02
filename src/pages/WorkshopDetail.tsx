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
import { PRICE_DOLLARS } from "../content/pricing"
import acousticBoyPhoto from "../assets/images/strip-acoustic-boy.webp"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"
// Same asset already used on the About page — reused here, not duplicated.
import facilitatorRedJumperPhoto from "../assets/images/facilitator-dave-red-jumper.webp"

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

// Bespoke to the 2026 spring holidays conversion page — replaces the
// generic workshop.whatToExpect bullet list, which was written in third
// person on a page that otherwise addresses "you" throughout. Kept local
// rather than added to the shared Workshop type since this two-panel
// layout isn't a general-purpose content shape other workshops would reuse.
const twoDayBreakdown = {
  heading: "How the Two Days Work",
  panels: [
    {
      day: "DAY 1",
      title: "Getting comfortable, finding the song",
      intro:
        "We'll kick off with activities to get everyone comfortable with each other, then move between free jam sessions and the bits that build a song:",
      bullets: [
        "Writing group lyrics — no sharing required",
        "Working out the feel and vibe of the song you want to make",
        "Playing around with chords and melodies that sound right to you",
        "Slowly piecing the whole thing together",
      ],
    },
    {
      day: "DAY 2",
      title: "Sharpening it up",
      intro: "Day 2 is about taking what you've got and making it sound like yours:",
      bullets: [
        "Rewriting and tightening the lyrics",
        "Trying new instruments and sounds",
        "Adding solos, for whoever's keen",
        "Switching instruments if you want to",
      ],
    },
  ],
  closing: [
    "By the end of the last run-through, the group will feel like a band.",
    "You'll leave knowing one of the most important parts of music: how to play with other people, and how good it feels to do it. Even with barely any experience, there's plenty you'll bring to the group. And if you've got years behind you, there's a lot to pick up from everyone else. Jamming with people at all different levels is the whole point — connection with other musos beats anything you'd learn in a music lesson.",
  ],
}

// Same reasoning as twoDayBreakdown above — this FAQ set is specific to the
// spring holidays conversion page's own objections/questions, distinct from
// (and complementary to) the evergreen SEO page's FAQ.
const springHolidaysFaqs: { q: string; a: string }[] = [
  {
    q: "Do I have to sing?",
    a: "No. Plenty of people won't. There's a whole band's worth of things to be doing, and you'll find the role that suits you.",
  },
  {
    q: "I'm 14 — will everyone else be older and better than me?",
    a: "The group runs 14 to 17, with a real mix of experience. That's on purpose, not by accident. Some people will have been playing for a decade, some for a year, and it genuinely doesn't create a hierarchy — everyone's writing something new together, so nobody's ahead.",
  },
  {
    q: "Do I need to be good?",
    a: "No. We'd prefer you've played something before, but exceptions are made for anyone with a real interest in starting. We don't do theory. Bring a willingness to muck around with songwriting and playing together and you'll be fine.",
  },
  {
    q: "What if I don't know anyone?",
    a: "Most people won't. The whole first morning is built around getting comfortable with each other, and with 8–12 of you nobody disappears into the back of the room.",
  },
  {
    q: "Do I need my own instrument?",
    a: "No — a range of instruments is available on the day. Bring your own if you've got one and want to use it.",
  },
  {
    q: "What happens after I book?",
    a: "You'll get a confirmation email straight away with all the workshop details, and I'll follow up a week before with everything specific you need to know.",
  },
  {
    q: "What if the cost is a problem?",
    a: "Email dave@goodnoiseproject.com.au and we'll sort a partial or full place. No questions asked, no awkwardness.",
  },
  {
    q: "Got a question that's not here?",
    a: "Just email dave@goodnoiseproject.com.au. Happy to answer anything — from a parent or from you directly.",
  },
]

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

  // Swaps the static "How much" row for the foundation-price display,
  // driven by the single price constant in `content/pricing.ts`.
  const infoRows = isSpringHolidays
    ? workshop.infoRows.map((row) =>
        row.label === "How much"
          ? {
              ...row,
              value: (
                <span className="flex flex-col items-end gap-1">
                  <span className="font-bold text-ink">${PRICE_DOLLARS}</span>
                  <span className="text-[11px] text-ink/60">for both days</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-terracotta">
                    Foundation Price · Our First Program
                  </span>
                </span>
              ),
            }
          : row,
      )
    : workshop.infoRows

  return (
    <div className={isSpringHolidays ? "gn-workshop-2026" : undefined}>
      {/* Intro / info summary */}
      {isSpringHolidays ? (
        <section className="bg-ink">
          <Header />

          {/* Addendum 6: no photo. Solid forest (already the section bg via
              .gn-workshop-2026) behind two columns — copy/CTA left, details
              card right, filling its column the way the photo used to.
              Mobile: single column, card follows straight after the CTA. */}
          <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-14 md:px-10 md:pt-14 md:pb-20">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="text-center md:text-left">
                <span className="gn-eyebrow text-[var(--gn-acid)]">
                  {workshop.eyebrow ?? "Workshop"}
                </span>

                <h1 className="font-display mt-4 text-white leading-[0.98] text-[13vw] md:text-[clamp(2.5rem,6vw,5.5rem)]">
                  Your <span className="gn-hl">Bandmates</span>
                  <br />
                  Are Waiting!
                </h1>

                <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/85 md:mx-0 md:text-lg">
                  Two days in North Perth jamming out an original song with a
                  bunch of other young musos. Ages 14–17 (a little outside
                  that?{" "}
                  <a
                    href="mailto:dave@goodnoiseproject.com.au"
                    className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta"
                  >
                    Flick us a message
                  </a>
                  ).
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 md:items-start">
                  <Link to={workshop.ctaHref} className="gn-btn-hero gn-btn-primary text-sm">
                    {workshop.ctaLabel} &rarr;
                  </Link>
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--gn-pink)]">
                    12 spots only · Our first ever program
                  </span>
                </div>
              </div>

              <div>
                <span className="gn-eyebrow mb-3 inline-block text-[var(--gn-acid)]">
                  Our First Ever Program
                </span>
                {/* .gn-card is the one featured card on this page — restored
                    per Addendum 6. Its own padding:22px is zeroed out since
                    WorkshopInfoCard's title/rows/footer regions already carry
                    their own internal padding; stacking both looked bloated. */}
                <WorkshopInfoCard
                  rows={infoRows}
                  title="2026 Spring Holiday Jam Program"
                  titleClassName="font-display text-4xl uppercase leading-[0.98] text-terracotta sm:text-5xl"
                  className="gn-card !p-0"
                />

                {/* Prominent scholarship callout — deliberately breaks this
                    page's "one .gn-card / two shadows per viewport" rule.
                    Someone who's decided the price is a problem has already
                    left by the time they reach the fine print, so this needs
                    to sit right in the decision path, not below it. */}
                {workshop.scholarshipCallout && (
                  <div className="gn-card-on-dark mt-6 border-2 border-[var(--gn-paper)] bg-[var(--gn-ink)] p-6">
                    <p className="font-display text-2xl uppercase leading-[0.98] text-terracotta">
                      {workshop.scholarshipCallout.heading}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
                      {linkifyEmail(workshop.scholarshipCallout.body)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {workshop.ageRangeNote && (
              <p className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-white/70">
                {linkifyEmail(workshop.ageRangeNote)}
              </p>
            )}
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

          {isSpringHolidays && (
            <div className="mt-6 max-w-2xl space-y-2 text-base leading-relaxed text-ink/80 md:text-lg">
              <p>
                <a
                  href="#faq"
                  className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                >
                  Read the FAQs &rarr;
                </a>
              </p>
              <p>
                {linkifyEmail(
                  "Questions? Contact Dave directly at dave@goodnoiseproject.com.au",
                )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* What to Expect / What to Bring — general-vibe expectations, shown
          above the day-by-day highlights below. On the spring holidays page,
          the two-day breakdown panels replace the generic bullet list — it's
          this page's heaviest-selling section, so it gets its own layout
          rather than the shared third-person "What to Expect" copy. */}
      {(workshop.whatToExpect || isSpringHolidays || workshop.whatToBring) && (
        <section className="bg-cream">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
            {isSpringHolidays ? (
              <div>
                <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                  {twoDayBreakdown.heading}
                </h2>
                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {twoDayBreakdown.panels.map((panel) => (
                    <div key={panel.day} className="gn-card-flat">
                      <span className="gn-eyebrow text-terracotta">{panel.day}</span>
                      <h3 className="font-display mt-3 text-xl uppercase leading-[0.98] text-ink sm:text-2xl">
                        {panel.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-ink/80 md:text-base">
                        {panel.intro}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {panel.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 border-t border-ink/15 pt-2 text-sm leading-relaxed text-ink/80 md:text-base"
                          >
                            <span className="mt-1 text-terracotta" aria-hidden="true">
                              &#9679;
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
                  {twoDayBreakdown.closing.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : (
              workshop.whatToExpect && (
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
              )
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
            {isSpringHolidays && (
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
                This is our first ever program, which means you'd be in the
                first group of people to ever do this — and part of shaping
                what Good Noise becomes.
              </p>
            )}
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
          above — for people not ready to commit to these dates. Burnt
          orange (not the surrounding bg-ink/forest) so it reads as its own
          distinct strip rather than blurring into "Kept Small On Purpose"
          above it. Bold + paper text for contrast against that fill. */}
      {workshop.slug === "2026-spring-holidays" && (
        <section className="bg-[var(--gn-pink)]">
          <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
            <p className="mx-auto max-w-md text-base font-bold leading-relaxed text-[var(--gn-paper)] md:text-lg">
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
            src={isSpringHolidays ? facilitatorRedJumperPhoto : facilitatorPhoto}
            alt={
              isSpringHolidays
                ? "Dave Sonntag, facilitator of the Good Noise Project school holiday jam program in Perth"
                : "Dave Sonntag playing acoustic guitar and singing into a microphone outdoors"
            }
            aspect="aspect-[4/5]"
            objectPosition="center 20%"
          />
          <div>
            <h2 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
              {workshop.facilitatorHeading}
            </h2>
            {isSpringHolidays ? (
              <div className="mt-6 max-w-md space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
                <p>
                  Dave Sonntag — a drummer of thirty years, a self-taught
                  singer-songwriter, and a dedicated mentor to young people.
                </p>
                <p>There'll be two facilitators running the program.</p>
                <p>
                  Both facilitators hold a current Western Australia Working
                  With Children Check and have years of experience mentoring
                  and facilitating with young people.
                </p>
                <Link
                  to={workshop.facilitatorLinkHref}
                  className="inline-block font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                >
                  {workshop.facilitatorLinkLabel} &rarr;
                </Link>
              </div>
            ) : (
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
                {workshop.facilitatorBio}{" "}
                <Link
                  to={workshop.facilitatorLinkHref}
                  className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                >
                  {workshop.facilitatorLinkLabel} &rarr;
                </Link>
              </p>
            )}

            <FacilitatorContact className="mt-6" />
          </div>
        </div>
      </section>

      {/* FAQ — spring holidays conversion page only. Sits after the
          facilitators (who's running it) and before the fine-print/refund
          table below, answering the objections most likely to be stopping
          someone from booking right now. */}
      {isSpringHolidays && (
        <section id="faq" className="scroll-mt-20 bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
              Questions You Might Have
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {springHolidaysFaqs.map((item) => (
                <div key={item.q} className="gn-card-flat">
                  <h3 className="font-body font-bold text-base text-ink md:text-lg">
                    {item.q}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                    {linkifyEmail(item.a)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prerequisites, scholarship, refund policy — each renders only if present.
          On the spring holidays page, prerequisites/scholarshipNote are
          deliberately suppressed here — that content now lives in the FAQ
          above (and the "Cost shouldn't decide this" callout in the hero
          already covers scholarships), so this block would otherwise repeat
          itself. The underlying workshop data is left untouched since the
          evergreen SEO page reads the same fields for its own FAQ. */}
      {(workshop.prerequisites ||
        workshop.scholarshipNote ||
        workshop.priceMatchNote ||
        workshop.refundPolicy) && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            {workshop.prerequisites && !isSpringHolidays && (
              <p className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                {workshop.prerequisites}
              </p>
            )}

            {workshop.scholarshipNote && !isSpringHolidays && (
              <div className="mt-8 max-w-2xl border-2 border-terracotta bg-terracotta/10 p-6">
                <p className="text-sm italic leading-relaxed text-ink/85 md:text-base">
                  {linkifyEmail(workshop.scholarshipNote)}
                </p>
              </div>
            )}

            {workshop.priceMatchNote && (
              <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ink/70">
                {workshop.priceMatchNote}
              </p>
            )}

            {workshop.refundPolicy && (
              <div id="cancellations" className="mt-8 max-w-md scroll-mt-24">
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
    </div>
  )
}
