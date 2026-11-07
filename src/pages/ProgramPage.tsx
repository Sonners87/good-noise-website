// Reusable summer 2026–27 program page, driven entirely by a ProgramConfig
// (src/content/programs.ts). Routed at /workshops/summer-holidays-2026-27/:program.
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import PhotoImage from "../components/PhotoImage"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import SubscribeForm from "../components/SubscribeForm"
import Placeholder from "../components/afterschool/Placeholder"
import { ProgramImage, ProgramVideo } from "../components/ProgramMedia"
import NotFound from "./NotFound"
import { programs, HUB_PATH, type ProgramConfig } from "../content/programs"
import { linkifyEmail } from "../lib/linkifyEmail"
import { setLandingPageMeta, SITE_URL } from "../lib/pageMeta"
import facilitatorPhoto from "../assets/images/facilitator-dave-red-jumper.webp"

function eventSchema(p: ProgramConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: p.name,
    description: p.meta.description,
    startDate: p.startISO,
    endDate: p.endISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    typicalAgeRange: "13-17",
    maximumAttendeeCapacity: p.maxGroup,
    location: {
      "@type": "Place",
      name: p.venueName,
      address: { "@type": "PostalAddress", ...p.venueAddress },
    },
    organizer: { "@type": "Organization", name: "Good Noise Project", url: SITE_URL },
    offers: {
      "@type": "Offer",
      price: String(p.priceDollars),
      priceCurrency: "AUD",
      url: `${SITE_URL}${p.path}`,
      availability: "https://schema.org/InStock",
    },
  }
}

export default function ProgramPage() {
  const { program: programSlug } = useParams<{ program: string }>()
  const p = programSlug ? programs[programSlug] : undefined

  useEffect(() => {
    if (!p) return
    setLandingPageMeta(p.meta.title, p.meta.description, {
      canonicalPath: p.path,
      structuredData: [eventSchema(p)],
    })
  }, [p])

  if (!p) return <NotFound />

  const infoRows = [
    { label: "When", value: p.dates },
    { label: "Time", value: p.time },
    { label: "Where", value: <span className="whitespace-pre-line">{p.venueLine}</span> },
    { label: "Who", value: p.ageText },
    { label: "Group size", value: `Max ${p.maxGroup} musos` },
    {
      label: "How much",
      value: (
        <span className="flex flex-col items-end gap-1">
          <span className="font-bold text-ink">${p.priceDollars}</span>
          <span className="text-[11px] text-ink/60">for both days</span>
        </span>
      ),
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-[var(--gn-acid)]">
        <Header tone="onAcid" />
        <div className="mx-auto max-w-[1400px] px-5 pt-10 pb-14 md:px-10 md:pt-14 md:pb-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <div className="text-center md:text-left">
              <span className="gn-eyebrow text-ink">{p.eyebrow}</span>
              <h1 className="font-display mt-4 text-[13vw] leading-[0.98] text-ink md:text-[clamp(2.5rem,6vw,5.5rem)]">
                {p.headline.before}
                <span className="gn-hl gn-hl-on-acid">{p.headline.highlight}</span>
                <br />
                {p.headline.after}
              </h1>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink/80 md:mx-0 md:text-lg">
                {p.subline}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 md:items-start">
                <Link to={p.bookPath} className="gn-btn-primary gn-btn-on-acid text-sm">
                  Book now &rarr;
                </Link>
                <Link
                  to={HUB_PATH}
                  className="font-body text-sm font-semibold text-ink underline decoration-2 underline-offset-4 hover:text-[var(--gn-paper)]"
                >
                  &larr; All summer programs
                </Link>
              </div>
            </div>

            <div>
              <WorkshopInfoCard
                rows={infoRows}
                title={`${p.place} Program`}
                titleClassName="font-display text-4xl uppercase leading-[0.98] text-[var(--gn-acid)] sm:text-5xl"
                className="gn-card !p-0"
              />
              <p className="mt-5 text-center text-sm leading-relaxed text-ink/80 md:text-left">
                {linkifyEmail(p.costNote)}
              </p>
              <p className="mt-2 text-center text-sm leading-relaxed text-ink/70 md:text-left">
                Outside ages 13–17?{" "}
                <a
                  href="mailto:dave@goodnoiseproject.com.au"
                  className="font-semibold underline decoration-2 underline-offset-4 hover:text-[var(--gn-paper)]"
                >
                  Talk to us
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro lead — statement band, same treatment as the hub's intro */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-24">
          <p className="font-display mx-auto max-w-4xl text-center text-2xl leading-[1.5] text-[var(--gn-paper)] sm:text-3xl md:text-4xl md:leading-[1.45]">
            {p.introLead.before}
            <span className="gn-hl">{p.introLead.highlight}</span>
            {p.introLead.after}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
            <div>
              <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
                {p.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
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
                  {linkifyEmail("Questions? Contact Dave directly at dave@goodnoiseproject.com.au")}
                </p>
              </div>
            </div>
            <ProgramImage
              image={p.media.images["intro-side"]}
              aspect="aspect-[3/2]"
              className="w-full"
            />
          </div>
          {/* Spare slot — left empty for now (may move up later). */}
          <ProgramImage image={p.media.images.intro} className="mt-12" />
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-cream">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-5 pb-16 md:px-10 md:pb-24">
          <div>
            <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
              {p.scheduleHeading}
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {p.panels.map((panel) => (
                <div key={panel.day} className="gn-card-flat">
                  {panel.imageKey && p.media.images[panel.imageKey] && (
                    <ProgramImage
                      image={p.media.images[panel.imageKey]}
                      aspect="aspect-[3/2]"
                      className="mb-5"
                    />
                  )}
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
              {p.scheduleClosing.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                What to Bring
              </h2>
              <ul className="mt-8 max-w-md space-y-3">
                {p.whatToBring.map((item) => (
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
            <ProgramImage
              image={p.media.images["what-to-bring"]}
              aspect="aspect-[4/5]"
              objectPosition="center 25%"
              className="mx-auto w-full max-w-sm md:ml-auto md:mr-0"
            />
          </div>

          <ProgramVideo video={p.media.video} className="mx-auto max-w-4xl" />
        </div>
      </section>

      {/* Kept small + Book now */}
      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
          <h2 className="font-display mx-auto max-w-xl text-4xl leading-[0.98] text-white sm:text-5xl">
            {p.keptSmall.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {p.keptSmall.note}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <PillButton href={p.bookPath} variant="acidOnDark">
              Book now
            </PillButton>
            <span className="font-body text-xs font-semibold text-white/70">
              ${p.priceDollars} for both days · Max {p.maxGroup} musos
            </span>
          </div>
        </div>
      </section>

      {/* Not ready to book */}
      <section className="bg-[var(--gn-acid)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <div className="gn-card-flat mx-auto max-w-xl text-center">
            <h2 className="font-display text-2xl uppercase leading-[0.98] text-ink sm:text-3xl">
              Not ready to book? Join the mailing list
            </h2>
            <SubscribeForm
              source={p.subscribeSource}
              variant="compact"
              submitLabel="Join the mailing list"
              className="mx-auto mt-5 w-full text-left"
            />
            <p className="mt-4 text-xs leading-relaxed text-ink/70">
              We never spam, and you can unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Facilitator */}
      <section id="facilitator" className="bg-cream">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
          <PhotoImage
            src={facilitatorPhoto}
            alt="Dave Sonntag, facilitator of the Good Noise Project school holiday jam program in Perth"
            aspect="aspect-[4/5]"
            objectPosition="center 20%"
          />
          <div>
            <h2 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
              {p.facilitatorHeading}
            </h2>
            <div className="mt-6 max-w-md space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
              <p>
                Dave Sonntag — a drummer of thirty years, a self-taught singer-songwriter, and a
                dedicated mentor to young people.
              </p>
              <p>There'll be two facilitators running the program.</p>
              <p>
                Both facilitators hold a current Western Australia Working With Children Check and
                have years of experience mentoring and facilitating with young people.
              </p>
              <Link
                to="/about"
                className="inline-block font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
              >
                More about Dave &rarr;
              </Link>
            </div>
            <FacilitatorContact className="mt-6" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
            Questions You Might Have
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {p.faqs.map((item) => (
              <div key={item.q} className="gn-card-flat">
                <h3 className="font-body text-base font-bold text-ink md:text-lg">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/80 md:text-base">
                  {linkifyEmail(item.a)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cancellations — linked from the booking form's consent wording */}
      <section id="cancellations" className="scroll-mt-24 bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
          {p.refundPolicy ? (
            <div className="max-w-md">
              <WorkshopInfoCard title="Cancellations & Refunds" rows={p.refundPolicy} />
            </div>
          ) : (
            <Placeholder kind="CHECK" className="max-w-xl">
              Cancellation &amp; refund policy for this program — the booking form's consent text
              links here. Add `refundPolicy` to the config.
            </Placeholder>
          )}
        </div>
      </section>

      {/* Cross-link + hub */}
      <section className="bg-[var(--gn-acid)]">
        <div className="mx-auto max-w-[1400px] px-5 py-12 text-center md:px-10 md:py-16">
          <Link
            to={p.crossLink.href}
            className="font-body text-base font-bold text-ink underline decoration-2 underline-offset-4 hover:text-[var(--gn-paper)] md:text-lg"
          >
            {p.crossLink.text} &rarr;
          </Link>
          <p className="mt-4">
            <Link
              to={HUB_PATH}
              className="font-body text-sm font-semibold text-ink/80 underline decoration-2 underline-offset-4 hover:text-[var(--gn-paper)]"
            >
              &larr; Back to all summer programs
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
