import { useEffect } from "react"
import { Link, useLocation, useParams } from "react-router-dom"
import Header, { type HeaderTone } from "../components/Header"
import Footer from "../components/Footer"
import Eyebrow from "../components/Eyebrow"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import FounderQuote from "../components/FounderQuote"
import NotFound from "./NotFound"
import WorkshopStayInLoopPopup, {
  LOOP_POPUP_ANCHOR_ID,
} from "../components/WorkshopStayInLoopPopup"
import SubscribeForm from "../components/SubscribeForm"
import { workshops } from "../content/workshops"
import { linkifyEmail } from "../lib/linkifyEmail"
import { setCanonical, setPageMeta } from "../lib/pageMeta"
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

// Every run of the two-day jam program shares one bespoke conversion layout
// — the hero below, the two-day breakdown, the FAQ and the CTA strip —
// listed here rather than checked slug-by-slug so a new run of the program
// picks all of it up by being added to this array. Which colours it wears is
// a separate question, answered by jamThemes below.
const JAM_PROGRAM_SLUGS = ["2026-spring-holidays", "christmas-holidays-jam-program"]

/*
  The two colour treatments a jam program page can wear.

  "acid" is the standard one, and the only one new programs should use. It
  sits in the site-wide audience suite: ink (black) for the homepage and For
  Schools, --gn-pink (blue) for For Parents, --gn-acid (orange) for
  participant-facing workshop pages. Text on the orange hero is ink or paper
  only — white on #FF4A00 is ~3.0:1 and fails AA at body size.

  "legacy" is the forest/burnt scheme (.gn-workshop-2026), kept ONLY because
  printed flyers for the 2026 spring program went out in those colours and
  changing the page mid-campaign would have read as a different organisation.
  It retires with that program — do not add a third page to it.
*/
type JamTheme = {
  wrapper?: string
  headerTone: HeaderTone
  heroSection: string
  eyebrow: string
  headline: string
  /** Add-on class for the headline's .gn-hl block. */
  highlight: string
  badge: string
  lead: string
  leadLink: string
  /** Add-on class for the hero's .gn-btn-primary CTA. */
  ctaButton: string
  ctaNote: string
  infoCardEyebrow: string
  infoCardTitle: string
  callout: string
  calloutHeading: string
  calloutBody: string
  ageNote: string
  /** Background for the trailing waitlist / register-interest strip. */
  ctaStrip: string
  /** Copy directly on that strip (not inside a card on it). */
  ctaStripText: string
  ctaStripButton: "outline" | "outlineOnDark"
  /** Primary CTA in the "Kept Small On Purpose" band, which is ink-filled. */
  limitedSpotsButton: "primary" | "acidOnDark"
}

const jamThemes: Record<"acid" | "legacy", JamTheme> = {
  acid: {
    headerTone: "onAcid",
    heroSection: "bg-[var(--gn-acid)]",
    eyebrow: "text-ink",
    headline: "text-ink",
    highlight: "gn-hl-on-acid",
    badge: "border-ink bg-ink text-[var(--gn-paper)]",
    lead: "text-ink/80",
    leadLink: "hover:text-[var(--gn-paper)]",
    ctaButton: "gn-btn-on-acid",
    ctaNote: "text-ink/70",
    infoCardEyebrow: "text-ink",
    // Display-size type, so acid on the card's paper fill clears AA large.
    // Never use it for the small print on this page.
    infoCardTitle: "text-[var(--gn-acid)]",
    callout: "border-ink bg-ink",
    calloutHeading: "text-[var(--gn-acid)]",
    calloutBody: "text-[var(--gn-paper)]/85",
    ageNote: "text-ink/70",
    ctaStrip: "bg-[var(--gn-acid)]",
    ctaStripText: "text-ink",
    ctaStripButton: "outline",
    limitedSpotsButton: "acidOnDark",
  },
  legacy: {
    wrapper: "gn-workshop-2026",
    headerTone: "onDark",
    heroSection: "bg-ink",
    eyebrow: "text-[var(--gn-acid)]",
    headline: "text-white",
    highlight: "",
    badge: "border-[var(--gn-paper)] bg-[var(--gn-pink)] text-[var(--gn-paper)]",
    lead: "text-white/85",
    leadLink: "hover:text-terracotta",
    ctaButton: "gn-btn-hero",
    ctaNote: "text-[var(--gn-pink)]",
    infoCardEyebrow: "text-[var(--gn-acid)]",
    infoCardTitle: "text-terracotta",
    callout: "gn-card-on-dark border-[var(--gn-paper)] bg-[var(--gn-ink)]",
    calloutHeading: "text-terracotta",
    calloutBody: "text-white/85",
    ageNote: "text-white/70",
    ctaStrip: "bg-[var(--gn-pink)]",
    ctaStripText: "text-[var(--gn-paper)]",
    ctaStripButton: "outlineOnDark",
    // Burnt orange on forest — reads fine, so this one stays as it was.
    limitedSpotsButton: "primary",
  },
}

// Bespoke to the jam program conversion pages — replaces the generic
// workshop.whatToExpect bullet list, which was written in third person on a
// page that otherwise addresses "you" throughout. Kept local rather than
// added to the shared Workshop type since this two-panel layout isn't a
// general-purpose content shape other workshops would reuse.
//
// Shared by every run of the jam program: same format, same two days, same
// telling. A differentiated rewrite per program was written and reviewed,
// then reverted in favour of keeping one voice across both pages.
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

// Specific to the jam program conversion pages' own objections/questions,
// distinct from (and complementary to) the evergreen SEO page's FAQ. Shared
// across both runs of the program, same as twoDayBreakdown above.
type Faq = { q: string; a: string }

const jamProgramFaqs: Faq[] = [
  {
    q: "Do I have to sing?",
    a: "No. Plenty of people won't. There's a whole band's worth of things to be doing, and you'll find the role that suits you.",
  },
  {
    q: "I'm 13 — will everyone else be older and better than me?",
    a: "The group runs 13 to 17, with a real mix of experience. That's on purpose, not by accident. Some people will have been playing for a decade, some for a year, and it genuinely doesn't create a hierarchy — everyone's writing something new together, so nobody's ahead.",
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

// "What happens after I book?" has no honest answer unless the program is
// actually on sale, so each other state swaps in the question it raises
// instead. The rest of the list still applies either way.
const BOOKED_FAQ_Q = "What happens after I book?"

const registerInterestFaq: Faq = {
  q: "When will the dates be announced?",
  a: "We're locking them in now, along with the venue. Register your interest above and you'll get an email the moment it's confirmed, with everything you need to know — before spots open to everyone else.",
}

const soldOutFaq: Faq = {
  q: "It's full — can I still get in?",
  a: "Sometimes. Cancellations do happen, and when one does we email the waitlist first. Join it above and you're in the running — and either way you'll hear about the next program before it's announced publicly.",
}

// `slugProp` lets a page mount this component directly against a fixed
// workshop (e.g. the /for-schools route) instead of reading the slug from
// the URL — same rendering, different route.
export default function WorkshopDetail({ slug: slugProp }: { slug?: string } = {}) {
  const { slug: slugParam } = useParams<{ slug: string }>()
  const slug = slugProp ?? slugParam
  const workshop = slug ? workshops[slug] : undefined
  const showFounderQuote = workshop?.slug === "in-school-songwriting"
  const { pathname } = useLocation()

  // Self-referencing canonical — this page is the deeper program/booking
  // page that /school-holiday-music-camp-perth links out to via "View full
  // program & book", so it needs its own canonical rather than pointing at
  // (or being redirected to) that landing page.
  useEffect(() => {
    if (workshop) {
      if (workshop.metaDescription) {
        setPageMeta(workshop.title, workshop.metaDescription)
      } else {
        document.title = workshop.title
      }
      setCanonical(pathname)
    }
  }, [workshop, pathname])

  if (!workshop) return <NotFound />

  const heroImage = heroImages[workshop.slug]
  // The bespoke forest/burnt conversion layout — hero, two-day breakdown,
  // FAQ, CTA strip — shared by every run of the two-day jam program.
  const isJamProgram = JAM_PROGRAM_SLUGS.includes(workshop.slug)
  // Only the 2026 spring program wears the legacy forest/burnt scheme, and
  // only until it has run — see jamThemes above.
  const theme = jamThemes[workshop.slug === "2026-spring-holidays" ? "legacy" : "acid"]
  // The first run of the program: the only one that can honestly call itself
  // that, and the only one with a Foundation Price to show.
  const isSpringHolidays = workshop.slug === "2026-spring-holidays"
  // Present only while the workshop is full (soldOut) or not yet scheduled
  // (registerInterest). Every Book CTA below checks these, so the page can
  // never hand a visitor to the Stripe form once either block is set in
  // content/workshops.ts.
  const soldOut = workshop.soldOut
  const registerInterest = workshop.registerInterest
  const faqs = jamProgramFaqs.map((item) => {
    if (item.q !== BOOKED_FAQ_Q) return item
    if (soldOut) return soldOutFaq
    if (registerInterest) return registerInterestFaq
    return item
  })
  // Whether anything in the trailing fine-print block will actually render:
  // on a jam program page prerequisites/scholarshipNote are suppressed (see
  // the block itself), so checking the raw fields would leave an empty
  // padded section on a program that carries only those two.
  const showFinePrint = Boolean(
    (workshop.prerequisites && !isJamProgram) ||
      (workshop.scholarshipNote && !isJamProgram) ||
      workshop.priceMatchNote ||
      workshop.refundPolicy,
  )
  const highlightsColumns =
    workshop.highlights.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"

  // While the program is full, price and group size come out of the details
  // card altogether — neither is something a waitlist visitor can act on,
  // and a "$80 / 8–12 musos" row sitting beside a FULL stamp still reads as
  // an offer. Otherwise the static "How much" row is swapped for the
  // foundation-price display, driven by the single price constant in
  // `content/pricing.ts`.
  const jamInfoRows = soldOut
    ? workshop.infoRows.filter(
        (row) => row.label !== "How much" && row.label !== "Group size",
      )
    : workshop.infoRows.map((row) =>
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

  const infoRows = isJamProgram ? jamInfoRows : workshop.infoRows

  return (
    <div className={isJamProgram ? theme.wrapper : undefined}>
      {/* Intro / info summary */}
      {isJamProgram ? (
        <section className={theme.heroSection}>
          <Header tone={theme.headerTone} />

          {/* Addendum 6: no photo. Solid forest (already the section bg via
              .gn-workshop-2026) behind two columns — copy/CTA left, details
              card right, filling its column the way the photo used to.
              Mobile: single column, card follows straight after the CTA. */}
          <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-14 md:px-10 md:pt-14 md:pb-20">
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className="text-center md:text-left">
                <span className={`gn-eyebrow ${theme.eyebrow}`}>
                  {workshop.eyebrow ?? "Workshop"}
                </span>

                <h1
                  className={`font-display mt-4 leading-[0.98] text-[13vw] md:text-[clamp(2.5rem,6vw,5.5rem)] ${theme.headline}`}
                >
                  {workshop.heroHeadline?.before}
                  <span className={`gn-hl ${theme.highlight}`}>
                    {workshop.heroHeadline?.highlight}
                  </span>
                  <br />
                  {workshop.heroHeadline?.after}
                </h1>

                {(soldOut || registerInterest) && (
                  /* The one thing an ad click or a returning visitor needs
                     to know before anything else on the page, so it sits
                     directly under the headline at heading scale rather
                     than as an eyebrow down in the CTA stack. Filled, not
                     outlined: against the forest hero an outline reads as a
                     label, a fill reads as a stamp. */
                  <p
                    className={`font-display mt-6 inline-block border-2 px-5 py-3 text-2xl uppercase leading-none sm:text-3xl md:text-4xl ${theme.badge}`}
                  >
                    {(soldOut ?? registerInterest)?.badge}
                  </p>
                )}

                <p
                  className={`mx-auto mt-5 max-w-md text-base leading-relaxed md:mx-0 md:text-lg ${theme.lead}`}
                >
                  {workshop.heroLead} (a little outside that?{" "}
                  <a
                    href="mailto:dave@goodnoiseproject.com.au"
                    className={`font-semibold underline decoration-2 underline-offset-4 ${theme.leadLink}`}
                  >
                    Flick us a message
                  </a>
                  ).
                </p>

                <div className="mt-8 flex flex-col items-center gap-3 md:items-start">
                  {soldOut ? (
                    <>
                      {/* Plain <a>, not Link: the waitlist block is a hash
                          target on this same page. The status itself is
                          already stamped under the headline above. */}
                      <a href="#waitlist" className={`gn-btn-primary text-sm ${theme.ctaButton}`}>
                        Join the waitlist &rarr;
                      </a>
                      <span className={`font-mono text-xs font-bold uppercase tracking-[0.12em] ${theme.ctaNote}`}>
                        Cancellations happen · The list hears first
                      </span>
                    </>
                  ) : registerInterest ? (
                    <>
                      {/* Same reasoning as the waitlist anchor above — the
                          register-interest form is a hash target on this
                          page, not a route. */}
                      <a
                        href="#register-interest"
                        className={`gn-btn-primary text-sm ${theme.ctaButton}`}
                      >
                        {workshop.ctaLabel} &rarr;
                      </a>
                      <span className={`font-mono text-xs font-bold uppercase tracking-[0.12em] ${theme.ctaNote}`}>
                        Small group · The list hears first
                      </span>
                    </>
                  ) : (
                    <>
                      <Link to={workshop.ctaHref} className={`gn-btn-primary text-sm ${theme.ctaButton}`}>
                        {workshop.ctaLabel} &rarr;
                      </Link>
                      <span className={`font-mono text-xs font-bold uppercase tracking-[0.12em] ${theme.ctaNote}`}>
                        12 spots only · Our first ever program
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                {workshop.infoCardEyebrow && (
                  <span className={`gn-eyebrow mb-3 inline-block ${theme.infoCardEyebrow}`}>
                    {workshop.infoCardEyebrow}
                  </span>
                )}
                {/* .gn-card is the one featured card on this page — restored
                    per Addendum 6. Its own padding:22px is zeroed out since
                    WorkshopInfoCard's title/rows/footer regions already carry
                    their own internal padding; stacking both looked bloated. */}
                <WorkshopInfoCard
                  rows={infoRows}
                  title={workshop.title}
                  titleClassName={`font-display text-4xl uppercase leading-[0.98] sm:text-5xl ${theme.infoCardTitle}`}
                  className="gn-card !p-0"
                />

                {/* Prominent scholarship callout — deliberately breaks this
                    page's "one .gn-card / two shadows per viewport" rule.
                    Someone who's decided the price is a problem has already
                    left by the time they reach the fine print, so this needs
                    to sit right in the decision path, not below it. */}
                {workshop.scholarshipCallout && !soldOut && (
                  <div className={`mt-6 border-2 p-6 ${theme.callout}`}>
                    <p
                      className={`font-display text-2xl uppercase leading-[0.98] ${theme.calloutHeading}`}
                    >
                      {workshop.scholarshipCallout.heading}
                    </p>
                    <p
                      className={`mt-3 text-sm leading-relaxed md:text-base ${theme.calloutBody}`}
                    >
                      {linkifyEmail(workshop.scholarshipCallout.body)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {workshop.ageRangeNote && (
              <p
                className={`mx-auto mt-8 max-w-md text-center text-sm leading-relaxed ${theme.ageNote}`}
              >
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
                className={isJamProgram && i === 0 ? "font-bold text-ink" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {isJamProgram && (
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
      {(workshop.whatToExpect || isJamProgram || workshop.whatToBring) && (
        <section className="bg-cream">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
            {isJamProgram ? (
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
              {soldOut ? (
                <PillButton href="#waitlist" variant={theme.limitedSpotsButton}>
                  Join the waitlist
                </PillButton>
              ) : registerInterest ? (
                <PillButton
                  href="#register-interest"
                  variant={theme.limitedSpotsButton}
                >
                  {workshop.ctaLabel}
                </PillButton>
              ) : (
                <>
                  <PillButton href={workshop.ctaHref} variant={theme.limitedSpotsButton}>
                    {workshop.ctaLabel}
                  </PillButton>
                  {/* Refund terms only matter to someone who can still book —
                      suppressed while the waitlist CTA stands in for the
                      booking one. The full policy table further down stays
                      put for anyone already booked in. */}
                  {workshop.refundShortNote && (
                    <span className="font-body font-semibold text-xs text-white/70">
                      {workshop.refundShortNote}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Scroll marker for WorkshopStayInLoopPopup's mobile trigger: sits
          directly below the primary booking CTA, so scrolling past it means
          the visitor has read the pitch and moved on without booking. An
          element rather than a scroll percentage, so edits to the copy above
          don't silently move the trigger point. */}
      {isSpringHolidays && <div id={LOOP_POPUP_ANCHOR_ID} aria-hidden="true" />}

      {/* Secondary CTA, deliberately away from the primary Book button
          above — for people not ready to commit to these dates. Burnt
          orange (not the surrounding bg-ink/forest) so it reads as its own
          distinct strip rather than blurring into "Kept Small On Purpose"
          above it. Bold + paper text for contrast against that fill. */}
      {isJamProgram &&
        (soldOut ? (
          /* Replaces the "Can't make these dates?" strip while the program
             is full — same strip, same audience, but the ask is now the only
             thing a visitor can act on, so the form itself lives here rather
             than a link off to /stay-in-touch. The form sits on a paper card
             because --gn-pink and --color-terracotta both resolve to burnt
             orange on this route: SubscribeForm's burnt submit button would
             disappear into the strip's own fill. */
          <section id="waitlist" className={`scroll-mt-20 ${theme.ctaStrip}`}>
            <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
              <div className="gn-card-flat mx-auto max-w-xl text-center">
                <span className="gn-eyebrow text-terracotta">{soldOut.badge}</span>
                <h2 className="font-display mt-4 text-3xl uppercase leading-[0.98] text-ink sm:text-4xl">
                  {soldOut.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink/80">
                  {soldOut.body}
                </p>

                <SubscribeForm
                  source={soldOut.subscribeSource}
                  variant="compact"
                  submitLabel="Join the waitlist"
                  className="mx-auto mt-7 w-full max-w-md text-left"
                />

                <p className="mt-5 text-sm leading-relaxed text-ink/70">
                  No spam, unsubscribe any time.{" "}
                  <Link
                    to="/stay-in-touch"
                    className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                  >
                    More about staying in touch &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </section>
        ) : registerInterest ? (
          /* Same strip and same card as the waitlist block above — the ask
             is just earlier in the program's life. Nothing here can be
             booked yet, so this form is the page's only conversion. */
          <section id="register-interest" className={`scroll-mt-20 ${theme.ctaStrip}`}>
            <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
              <div className="gn-card-flat mx-auto max-w-xl text-center">
                <span className="gn-eyebrow text-terracotta">
                  {registerInterest.badge}
                </span>
                <h2 className="font-display mt-4 text-3xl uppercase leading-[0.98] text-ink sm:text-4xl">
                  {registerInterest.heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink/80">
                  {registerInterest.body}
                </p>

                <SubscribeForm
                  source={registerInterest.subscribeSource}
                  variant="card"
                  submitLabel={workshop.ctaLabel}
                  className="mx-auto mt-7 w-full max-w-md text-left"
                />

                <p className="mt-5 text-sm leading-relaxed text-ink/70">
                  No spam, unsubscribe any time.{" "}
                  <Link
                    to="/stay-in-touch"
                    className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                  >
                    More about staying in touch &rarr;
                  </Link>
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className={theme.ctaStrip}>
            <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
              <p
                className={`mx-auto max-w-md text-base font-bold leading-relaxed md:text-lg ${theme.ctaStripText}`}
              >
                Can't make these dates?
              </p>
              <div className="mt-5">
                <PillButton href="/stay-in-touch" variant={theme.ctaStripButton}>
                  Get notified about future workshops
                </PillButton>
              </div>
            </div>
          </section>
        ))}

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
            src={isJamProgram ? facilitatorRedJumperPhoto : facilitatorPhoto}
            alt={
              isJamProgram
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
            {isJamProgram ? (
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

      {/* FAQ — jam program conversion pages only. Sits after the
          facilitators (who's running it) and before the fine-print/refund
          table below, answering the objections most likely to be stopping
          someone from booking right now. */}
      {isJamProgram && (
        <section id="faq" className="scroll-mt-20 bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
              Questions You Might Have
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {faqs.map((item) => (
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
          On the jam program pages, prerequisites/scholarshipNote are
          deliberately suppressed here — that content now lives in the FAQ
          above (and the "Cost shouldn't decide this" callout in the hero
          already covers scholarships), so this block would otherwise repeat
          itself. The underlying workshop data is left untouched since the
          evergreen SEO page reads the same fields for its own FAQ. */}
      {showFinePrint && (
        <section className="bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
            {workshop.prerequisites && !isJamProgram && (
              <p className="max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                {workshop.prerequisites}
              </p>
            )}

            {workshop.scholarshipNote && !isJamProgram && (
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

      {isSpringHolidays && <WorkshopStayInLoopPopup />}
    </div>
  )
}
