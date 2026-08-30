// Dedicated SEO landing page targeting "school holiday music camp" (+
// variations: "school holidays music workshop", "holiday music program for
// teens", "music camp for kids") geo-tagged to Perth, WA. Built as a
// standalone search-traffic entry point (like HolidayCamps.tsx) rather than
// a primary-nav destination — see the link out to it from IntroSection.tsx
// on the homepage. Content facts (dates, price, what to bring, etc.) are
// read straight from workshops.ts rather than re-typed, so this page can't
// drift out of sync with the workshop's own detail page.
import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PhotoImage from "../components/PhotoImage"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import WhyWeExist from "../components/WhyWeExist"
import SafetyFirst from "../components/SafetyFirst"
import Facilitator from "../components/Facilitator"
import PillButton from "../components/PillButton"
import { workshops } from "../content/workshops"
import { linkifyEmail } from "../lib/linkifyEmail"
import { setLandingPageMeta } from "../lib/pageMeta"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"

const CAMP_SLUG = "2026-spring-holidays"
const WORKSHOP_HREF = `/workshops/${CAMP_SLUG}`
const camp = workshops[CAMP_SLUG]

const PAGE_TITLE = "School Holiday Music Camp Perth | Good Noise Project"
const PAGE_DESCRIPTION =
  "Perth's school holiday music camp for teens 14–17. Two days in North Perth writing, jamming and performing an original song together. Spring 2026 — book now."

// Plain q/a strings double as both the visible FAQ copy (rendered through
// linkifyEmail below) and the FAQPage structured-data text, so the two
// can't drift apart.
const faqs: { q: string; a: string }[] = [
  {
    q: "What ages is this school holiday music camp for?",
    a: "This program is for teens aged 14–17. Outside that range? Email dave@goodnoiseproject.com.au and we'll let you know what's coming up for other ages.",
  },
  {
    q: "Where in Perth is the camp held?",
    a: "At Player 1 Music School, 5 Woodville Lane, North Perth WA 6006 — an easy stop for families from Perth's inner, northern and western suburbs.",
  },
  {
    q: "Does my teen need to already play an instrument?",
    a: camp.prerequisites ?? "",
  },
  {
    q: "What's included, and what should we bring?",
    a: "A range of instruments is provided on the day, plus a facilitator running the group the whole way through. Bring your own instrument if you have one, along with a water bottle, packed lunch and snacks for each day.",
  },
  {
    q: "How is this different from a typical school holidays music workshop?",
    a: "There's no theory, no benchmarks and nobody's singled out to perform solo — it's a small group writing, arranging and performing one original song together, facilitated by a working musician rather than taught like a classroom lesson.",
  },
  {
    q: "Is financial help available?",
    a: camp.scholarshipNote ?? "",
  },
  {
    q: "What if these dates don't work for us?",
    a: "Join the mailing list on our Stay in Touch page and we'll let you know as soon as the next school holiday music camp is announced.",
  },
]

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      name: "2026 Spring Holidays Jam Program — School Holiday Music Camp",
      description: camp.teaser,
      startDate: "2026-09-30T09:00:00+08:00",
      endDate: "2026-10-01T15:00:00+08:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Player 1 Music School",
        address: {
          "@type": "PostalAddress",
          streetAddress: "5 Woodville Lane",
          addressLocality: "North Perth",
          addressRegion: "WA",
          postalCode: "6006",
          addressCountry: "AU",
        },
      },
      image: ["https://goodnoiseproject.com.au/og-image.png"],
      organizer: {
        "@type": "Organization",
        name: "Good Noise Project",
        url: "https://goodnoiseproject.com.au/",
      },
      offers: {
        "@type": "Offer",
        price: "80",
        priceCurrency: "AUD",
        availability: "https://schema.org/InStock",
        url: `https://goodnoiseproject.com.au${WORKSHOP_HREF}`,
        validFrom: "2026-08-30",
      },
      typicalAgeRange: "14-17",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
}

export default function SchoolHolidayMusicCamp() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, {
      canonicalPath: "/school-holiday-music-camp-perth",
      structuredData,
    })
  }, [])

  return (
    <>
      <div className="bg-ink">
        <Header />
      </div>

      {/* Opening — keyword-forward H1, no rotation/highlight-behind-headline
          (Volume 2 register: this page is mostly a parent's search-result
          landing spot, not the teen-facing homepage hero). */}
      <section className="bg-[var(--gn-pink)]">
        <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-14 md:px-10 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <span className="gn-eyebrow text-ink">School Holiday Music Camp · Perth, WA</span>

              <h1 className="font-display mt-4 max-w-xl text-4xl leading-[1.02] text-ink sm:text-5xl">
                Perth's School Holiday Music Camp For Teens
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
                Good Noise Project runs a school holiday music camp in North
                Perth for teens aged 14–17 — two days writing, jamming and
                performing an original song together, no experience or
                theory required. It's the next school holidays music
                workshop worth clearing the calendar for.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <PillButton href={WORKSHOP_HREF} variant="onLight">
                  See dates &amp; book &rarr;
                </PillButton>
              </div>
            </div>

            <PhotoImage
              src={bandPracticePhoto}
              alt="Two teenage musicians at a school holiday music camp in Perth, one playing electric guitar and singing into a microphone"
              aspect="aspect-[4/5]"
              className="border-2 border-ink"
              objectPosition="center 25%"
            />
          </div>
        </div>
      </section>

      {/* Why We Exist — reused word-for-word from the homepage, gives this
          landing page real mission/trust content beyond the program logistics. */}
      <WhyWeExist />

      {/* Featured program card — the one .gn-card on this page. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="gn-eyebrow text-ink">This spring's program</span>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            2026 Spring Holidays Jam Program
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
            {camp.introParagraphs[0]}
          </p>

          <div className="mt-10 max-w-md">
            <WorkshopInfoCard
              rows={camp.infoRows}
              title={camp.title}
              titleClassName="font-display text-2xl uppercase leading-[0.98] text-terracotta sm:text-3xl"
              ctaLabel="View full program & book"
              ctaHref={WORKSHOP_HREF}
              className="gn-card !p-0"
            >
              <p className="mt-3 text-center font-body font-semibold text-xs text-ink/60">
                {camp.refundShortNote}
              </p>
            </WorkshopInfoCard>
          </div>
        </div>
      </section>

      {/* What to Expect / What to Bring — same facts as the workshop detail
          page, read straight from workshops.ts. */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
          {camp.whatToExpect && (
            <div>
              <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                What Your Teen Will Experience
              </h2>
              <ul className="mt-8 max-w-2xl space-y-3">
                {camp.whatToExpect.map((item) => (
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

          {camp.whatToBring && (
            <div>
              <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                What to Bring
              </h2>
              <ul className="mt-8 max-w-md space-y-3">
                {camp.whatToBring.map((item) => (
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

      {/* Trust/safety — reused word-for-word from the homepage. Answers
          "why this camp and not another one" for parents comparison-shopping
          Perth's school holiday music camps. */}
      <SafetyFirst />

      {/* Facilitator — reused word-for-word from the homepage. */}
      <Facilitator />

      {/* FAQ — targets long-tail/People Also Ask queries, mirrored into the
          FAQPage structured data above. */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <span className="gn-eyebrow text-ink">FAQ</span>
          <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q} className="gn-card-flat">
                <h3 className="font-body font-bold text-base text-ink md:text-lg">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                  {linkifyEmail(item.a)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
          <h2 className="font-display mx-auto max-w-xl text-4xl leading-[0.98] text-white sm:text-5xl">
            Ready for Perth's Next School Holiday Music Camp?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {camp.limitedSpotsNote}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <PillButton href={WORKSHOP_HREF} variant="primary">
              View program &amp; book your place
            </PillButton>
            {camp.refundShortNote && (
              <span className="font-body font-semibold text-xs text-white/70">
                {camp.refundShortNote}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[var(--gn-pink)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <p className="mx-auto max-w-md text-base font-bold leading-relaxed text-ink md:text-lg">
            Can't make these dates?
          </p>
          <div className="mt-5">
            <Link
              to="/stay-in-touch"
              className="gn-btn-secondary text-[13px] text-ink"
            >
              Get notified about future workshops &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
