// Evergreen SEO landing page targeting "school holiday music camp Perth" (+
// variants: school holiday music program, school holidays music workshop,
// holiday music program Perth, music camp for teenagers Perth). Permanent
// URL — the current program is shown as a swappable card in "What's Coming
// Up" (src/data/upcomingProgram.ts), not baked into the page copy, so this
// page survives past the current program's dates without a rewrite.
import { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PhotoImage from "../components/PhotoImage"
import ProgramCard from "../components/ProgramCard"
import PillButton from "../components/PillButton"
import { linkifyEmail } from "../lib/linkifyEmail"
import { setLandingPageMeta, SITE_URL } from "../lib/pageMeta"
import { upcomingProgram } from "../data/upcomingProgram"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"
import concertFriendsPhoto from "../assets/images/strip-concert-friends.webp"
import drummerPhoto from "../assets/images/strip-drummer.webp"
import buskerPhoto from "../assets/images/strip-busker.webp"
import logoAsset from "../assets/logo/good-noise-logo.png"

const PAGE_TITLE = "School Holiday Music Camp Perth | Ages 14–17 | Good Noise"
const PAGE_DESCRIPTION =
  "Two-day school holiday music camps in Perth for ages 14–17. Write and jam an original song with a small group. Next: 30 Sep – 1 Oct 2026, North Perth, $80."
const CANONICAL_PATH = "/school-holiday-music-camp-perth"

const whatHappens: { bold: string; rest: string }[] = [
  {
    bold: "Day 1 is all exploration",
    rest: " — trying instruments, finding a role in the group, shaping ideas together. No theory lessons, no sitting and listening.",
  },
  {
    bold: "Day 2 is about one thing",
    rest: " — taking the song the group has written and jamming it out together, properly.",
  },
  {
    bold: "No solo pressure",
    rest: " — nobody's singled out or judged individually. It's a group effort from start to finish.",
  },
  {
    bold: "Small group size",
    rest: " — kept deliberately small so every voice actually gets heard, not lost in a crowd.",
  },
  {
    bold: "Facilitated the whole way through by Dave",
    rest: " — a working musician, not a classroom teacher running a lesson plan.",
  },
  {
    bold: "Instruments provided",
    rest: " — bring your own if you've got one, but you don't need one to take part.",
  },
]

const whatToBring = [
  "Your instrument (a range of instruments is available)",
  "Water bottle",
  "Packed lunch & snacks each day",
  "Earplugs (if sensitive to noise)",
]

const waHolidayDates = [
  { period: "Spring holidays 2026", dates: "Sat 26 Sep – Sun 11 Oct 2026" },
  { period: "Summer holidays 2026–27", dates: "Fri 18 Dec 2026 – Sun 31 Jan 2027" },
]

// Plain q/a strings double as both the visible FAQ copy (rendered through
// linkifyEmail below) and the FAQPage structured-data text, so the two can't
// drift apart.
const faqs: { q: string; a: string }[] = [
  {
    q: "What is a school holiday music camp?",
    a: "It's a short, intensive music program that runs during the school holidays rather than as weekly term lessons. Ours is two full days in North Perth: a small group of teenagers writes an original song together and spends the second day jamming it out as a band. No theory, no assessment.",
  },
  {
    q: "What ages is this for?",
    a: "This program is for teens aged 14–17. Outside that range? Email dave@goodnoiseproject.com.au and we'll let you know what's coming up for other ages.",
  },
  {
    q: "Where in Perth is it held?",
    a: "At Player 1 Music School, 5 Woodville Lane, North Perth WA 6006 — an easy stop for families from Perth's inner, northern and western suburbs.",
  },
  {
    q: "When are the September and October 2026 school holidays in WA?",
    a: "Term 3 finishes on Friday 25 September 2026 and the spring holidays run from Saturday 26 September to Sunday 11 October. Term 4 starts on Monday 12 October. Our program runs in the first week of the break, on Wednesday 30 September and Thursday 1 October.",
  },
  {
    q: "How much does it cost?",
    a: "$80 for both days — a Foundation Price for our first program. Free and part scholarships are available, no questions asked. Just email dave@goodnoiseproject.com.au.",
  },
  {
    q: "Does my teen need to already play an instrument?",
    a: "While we prefer each participant has prior music experience, exceptions can be made for those with a big interest in starting to play. We don't focus on music theory, but a willingness to learn about songwriting, composition and playing together is a must.",
  },
  {
    q: "What's included, and what should we bring?",
    a: "A range of instruments is provided on the day, plus facilitators running the group the whole way through. Bring your own instrument if you have one, along with a water bottle, packed lunch and snacks for each day.",
  },
  {
    q: "How is this different from music lessons or a typical holiday workshop?",
    a: "There's no curriculum and no set piece to learn. The group writes something new and jams it out together, rather than working through a syllabus or rehearsing a cover. Nobody is assessed and nobody is singled out to play solo.",
  },
  {
    q: "What if my teen doesn't know anyone there?",
    a: "Most people arrive not knowing anyone — that's the normal case, not the exception. The whole first day is built around finding a role in the group and getting comfortable with each other, and the group is kept small enough that nobody disappears into the back of the room.",
  },
  {
    q: "Is financial help available?",
    a: "We have a no-questions-asked scholarship policy to ensure our workshops are accessible to everyone who wants to participate. If the cost presents a significant financial barrier, please reach out to dave@goodnoiseproject.com.au for a partial or full scholarship.",
  },
  {
    q: "What if these dates don't work for us?",
    a: "Join the mailing list on our Stay in Touch page and we'll let you know as soon as the next program is announced.",
  },
]

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Good Noise Project",
  url: SITE_URL,
  email: "dave@goodnoiseproject.com.au",
  telephone: "+61413626240",
  logo: `${SITE_URL}${logoAsset}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "36 Park St",
    addressLocality: "Como",
    addressRegion: "WA",
    postalCode: "6152",
    addressCountry: "AU",
  },
  areaServed: { "@type": "City", name: "Perth" },
  founder: { "@type": "Person", name: "Dave Sonntag" },
}

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: upcomingProgram.title,
  description: upcomingProgram.eventDescription,
  startDate: upcomingProgram.startDateISO,
  endDate: upcomingProgram.endDateISO,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  typicalAgeRange: upcomingProgram.ages,
  isAccessibleForFree: false,
  inLanguage: "en-AU",
  url: `${SITE_URL}${CANONICAL_PATH}`,
  image: [`${SITE_URL}/og-image.png`],
  location: {
    "@type": "Place",
    name: upcomingProgram.venueName,
    address: {
      "@type": "PostalAddress",
      ...upcomingProgram.venueAddress,
    },
  },
  organizer: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    price: String(upcomingProgram.price),
    priceCurrency: "AUD",
    availability: "https://schema.org/InStock",
    url: upcomingProgram.bookingUrl,
    validFrom: upcomingProgram.validFromISO,
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}

export default function SchoolHolidayMusicCamp() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, {
      canonicalPath: CANONICAL_PATH,
      structuredData: [organizationJsonLd, eventJsonLd, faqJsonLd],
    })
  }, [])

  return (
    <>
      <div className="bg-ink">
        <Header />
      </div>

      {/* Section 1 — Hero */}
      <section className="bg-[var(--gn-pink)]">
        <div className="mx-auto max-w-[1400px] px-5 pt-12 pb-14 md:px-10 md:pt-16 md:pb-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <span className="gn-eyebrow text-ink">School Holiday Music Camp · Perth, WA</span>

              <h1 className="font-display mt-4 max-w-xl text-4xl leading-[1.02] text-ink sm:text-5xl">
                School Holiday Music Camps in Perth
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
                Good Noise Project runs school holiday music camps in Perth
                for teenage musicians. Over two days, a small group writes an
                original song and jams it out together — no theory lessons,
                no benchmarks, nobody put on the spot. Our next program runs
                30 September – 1 October 2026 in North Perth, for ages
                14–17, and it's $80 for both days.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <PillButton href="#whats-on" variant="onLight">
                  See what's on &rarr;
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

      {/* Section 2 — What's Coming Up */}
      <section id="whats-on" className="scroll-mt-20 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            What's Coming Up
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
            Here's the next Good Noise school holiday music program in
            Perth. We run one at a time and keep the group small.
          </p>

          <div className="mt-10 max-w-md">
            <ProgramCard
              title={upcomingProgram.title}
              price={upcomingProgram.price}
              priceLabel={upcomingProgram.priceLabel}
              scholarshipNote={upcomingProgram.scholarshipNote}
              rows={upcomingProgram.rows}
              ctaLabel={upcomingProgram.ctaLabel}
              ctaHref={upcomingProgram.ctaHref}
              refundNote={upcomingProgram.refundNote}
            />
          </div>
        </div>
      </section>

      {/* Section 3 — What Happens */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
          <div>
            <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
              What Happens at a Good Noise Music Camp
            </h2>
            <ul className="mt-8 max-w-2xl space-y-3">
              {whatHappens.map((item) => (
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

          <div>
            <h3 className="font-display max-w-3xl text-2xl leading-[0.98] text-ink sm:text-3xl">
              What to Bring
            </h3>
            <ul className="mt-8 max-w-md space-y-3">
              {whatToBring.map((item) => (
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
        </div>
      </section>

      {/* Section 4 — How This Is Different */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            How This Is Different From Other School Holiday Programs in Perth
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
            <p>
              Most Perth school holiday music programs fall into one of two
              shapes: a structured lesson in a holiday wrapper — learn the
              basics of an instrument over two mornings, take home a
              worksheet and a certificate — or a rock camp, where a group
              rehearses an existing song and plays it at a mini-concert for
              families at the end of the day.
            </p>
            <p>Both are good things. This is neither.</p>
            <p>
              There's no curriculum and no set piece. The group writes
              something that didn't exist on the first morning, then spends
              the second day jamming it out until it sounds like theirs.
              Nobody is assessed, nobody plays solo, and there's no showcase
              to get nervous about.
            </p>
            <p>
              The point isn't what comes out at the end. It's two days of
              playing music in a room with people you've just met — which is
              rarer than it sounds for teenagers who mostly practise alone
              in a bedroom.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — Who It's For */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            Who Our Perth School Holiday Music Camps Are For
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
            <p>Right now Good Noise runs one program, for ages 14–17.</p>
            <p>
              It suits young musicians who've been playing something for a
              year or more — drums, guitar, bass, keys, voice, whatever it
              is — but who've never really played with other people. You
              don't need theory. You don't need to be good. You do need to
              be up for making some noise in a room with people you don't
              know yet.
            </p>
            <p>
              {linkifyEmail(
                "Outside that age range? Email dave@goodnoiseproject.com.au — programs for other age groups are in development, and we'll let you know what's coming.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Section 6 — Why We Run These */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-white md:px-10 md:py-24">
          <h2 className="font-display max-w-2xl text-4xl leading-[0.98] sm:text-5xl">
            Why We Run These
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            A 2025 University of Sydney report found 43% of young Australians
            feel lonely<sup>1</sup>. Music won't fix that on its own. But
            playing music together is one of the most reliable ways humans
            have ever connected with others.
          </p>
          <p className="mt-2 max-w-xl text-xs text-white/50">
            1. https://www.sydney.edu.au/news-opinion/news/2025/08/04/more-than-40-percent-of-young-aussies-are-lonely-as-experts-call-for-national-loneliness-strategy.html
          </p>
          <Link
            to="/for-parents"
            className="mt-6 inline-block font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-white"
          >
            More about why Good Noise exists &rarr;
          </Link>
        </div>
      </section>

      {/* Section 7 — Here to Play, Not to Prove (brand-defining, unchanged) */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="py-16 md:py-24">
            <h2 className="font-display max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Here to Play, Not to Prove.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
              Every participant of a Good Noise Project workshop is treated
              the same, regardless of skill, background, or how long
              they've been playing. No judgement. No hierarchy. And no
              pressure to share before you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 border-t border-cream/15 md:grid-cols-3">
            {[
              {
                title: "No Judgement",
                body: "We embrace mistakes — that's where the good stuff comes from.",
                photo: concertFriendsPhoto,
                alt: "A group of teenage girls laughing together in a crowd",
              },
              {
                title: "No Hierarchy",
                body: "Nobody's here to perform, prove themselves, or hit a benchmark.",
                photo: drummerPhoto,
                alt: "A young drummer performing under green stage light",
              },
              {
                title: "No Pressure",
                body: "Share when you're ready — not a moment before.",
                photo: buskerPhoto,
                alt: "A young woman singing into a microphone while playing acoustic guitar",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="border-b border-cream/15 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <h3 className="font-display text-xl">{pillar.title}</h3>
                <PhotoImage
                  src={pillar.photo}
                  alt={pillar.alt}
                  aspect="aspect-[4/3]"
                  className="mt-6"
                />
                <p className="mt-5 text-sm leading-relaxed text-cream/70">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Who Runs It */}
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
              Who Runs It
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
              Good Noise Project is run by Dave Sonntag — a drummer of
              thirty years, a self-taught singer-songwriter, and a
              dedicated mentor to young people.
            </p>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
              There'll be two facilitators running each program. Both hold a
              current Western Australia Working With Children Check and have
              years of experience mentoring and facilitating with young
              people.
            </p>

            <div className="mt-6 flex flex-col gap-1.5 font-body text-sm text-ink/70">
              <a href="tel:+61413626240" className="transition hover:text-terracotta">
                <span className="font-semibold text-ink/50">M</span> +61 413 626 240
              </a>
              <a
                href="mailto:dave@goodnoiseproject.com.au"
                className="transition hover:text-terracotta"
              >
                <span className="font-semibold text-ink/50">E</span> dave@goodnoiseproject.com.au
              </a>
            </div>

            <Link to="/about" className="gn-btn-secondary mt-9 text-[13px]">
              Read Dave's story &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Section 9 — WA School Holiday Dates */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            WA School Holiday Dates
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
            Planning ahead? Here are the remaining Western Australian public
            school holiday periods.
          </p>

          <div className="mt-8 max-w-2xl border-2 border-ink">
            {waHolidayDates.map((row, i) => (
              <div
                key={row.period}
                className={`flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${i === waHolidayDates.length - 1 ? "" : "border-b border-ink/15"}`}
              >
                <span className="font-body font-semibold text-sm text-ink">{row.period}</span>
                <span className="font-body font-semibold text-sm text-ink/80">{row.dates}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
            Dates are for WA public schools. Catholic and independent
            schools may differ — check with your school.
          </p>
          {/* TODO: add 2027 WA term dates once confirmed */}
        </div>
      </section>

      {/* Section 10 — FAQ */}
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
                  {item.q === "What if these dates don't work for us?" ? (
                    <>
                      Join the mailing list on our{" "}
                      <Link
                        to="/stay-in-touch"
                        className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
                      >
                        Stay in Touch page
                      </Link>{" "}
                      and we'll let you know as soon as the next program is
                      announced.
                    </>
                  ) : (
                    linkifyEmail(item.a)
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11 — Final CTA */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
          <h2 className="font-display mx-auto max-w-xl text-4xl leading-[0.98] text-white sm:text-5xl">
            Ready for Perth's Next School Holiday Music Camp?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            Spots are limited to a small group to ensure everyone feels
            comfortable, included and has their voice heard (if they want
            it to be!).
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <PillButton href={upcomingProgram.ctaHref} variant="primary">
              View program &amp; book your place
            </PillButton>
            <span className="font-body font-semibold text-xs text-white/70">
              Refund for cancellations 2+ weeks before.
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[var(--gn-pink)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <div className="mt-5">
            <Link to="/stay-in-touch" className="gn-btn-secondary text-[13px] text-ink">
              Get notified about future workshops &rarr;
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
