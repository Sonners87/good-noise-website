// Shown after a successful Stripe payment (the Payment Link's confirmation
// URL points here). Driven by the program's config; the same message goes out
// as an email from netlify/functions/stripe-webhook.js — keep the two in sync.
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import NotFound from "./NotFound"
import { ProgramPhoto } from "../components/ProgramMedia"
import { programs } from "../content/programs"
import { trackMetaEvent } from "../lib/metaPixel"
import { markCheckoutStarted } from "../lib/bookingIntent"

export default function ProgramConfirmed() {
  const { program: programSlug } = useParams<{ program: string }>()
  const p = programSlug ? programs[programSlug] : undefined

  useEffect(() => {
    if (!p) return
    document.title = "You're In — Good Noise Project"
    const robots = document.createElement("meta")
    robots.name = "robots"
    robots.content = "noindex"
    document.head.appendChild(robots)
    markCheckoutStarted()
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get("session_id") ?? undefined
    // Test purchases (Stripe redirect ending in ?test=1) must not count as
    // real conversions in Meta.
    if (params.get("test") !== "1") {
      trackMetaEvent("Purchase", { value: p.priceDollars, currency: "AUD" }, sessionId)
    }
    return () => robots.remove()
  }, [p])

  if (!p) return <NotFound />

  return (
    <div className={p.theme === "blue" ? "gn-theme-blue" : undefined}>
      {/* Hero wears the program page's colour: orange for North Perth, blue for Cockburn. */}
      <section className="bg-[var(--gn-acid)]">
        <Header tone="onAcid" />
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
          <h1 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl md:text-6xl">
            You're in! Welcome to the band.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            Hey there! You're officially locked in for Good Noise Project's Summer Holidays Jam Program ({p.place})! We're so
            excited to have you on board.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          {/* Two rows on desktop so the photo's top lines up with the "The two/three
              days…" paragraph beside it, whatever height the list above ends up. */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-x-12 md:gap-y-8">
            <div className="md:col-start-1 md:row-start-1">
              <h2 className="font-display text-2xl leading-[0.98] text-ink sm:text-3xl">
                Here's What You Need to Know
              </h2>
              <h2 className="font-display mt-9 text-2xl leading-[0.98] text-ink sm:text-3xl">
                What to Bring Each Day
              </h2>
              <ul className="mt-4 space-y-3">
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

            <p className="font-body text-base leading-relaxed text-ink/80 md:col-start-1 md:row-start-2 md:text-lg">
              The {p.daysWord} are all about fun, creativity and good vibes. There's no pressure —
              just {p.daysWord} of jamming, creating music and finding some likeminded musos to
              make noise with.
            </p>

            <div className="md:col-start-2 md:row-start-1">
              <WorkshopInfoCard
                title="Event Details"
                rows={[
                  { label: "When", value: `${p.dates}\n${p.time}` },
                  { label: "Where", value: p.venueLine },
                ]}
              />
            </div>

            {p.confirmedImage && (
              <div className="md:col-start-2 md:row-span-2 md:row-start-2">
                <ProgramPhoto image={p.confirmedImage} />
              </div>
            )}

            <div className="mt-6 max-w-xl border-t-2 border-ink/15 pt-10 md:col-start-1 md:row-start-3 md:mt-8">
              <p className="font-body text-base leading-relaxed text-ink/80 md:text-lg">
                I'll be in touch closer to the date with any last bits of info you need. In the
                meantime, if you've got questions, just reply to your confirmation email or reach me
                directly:
              </p>
              <FacilitatorContact className="mt-6" />
              <p className="mt-8 font-body text-base leading-relaxed text-ink/80 md:text-lg">
                Can't wait to see you there!
              </p>
              <p className="font-display mt-6 text-2xl text-terracotta">Dave</p>
              <p className="font-body text-sm text-ink/60">Good Noise Project</p>
              <Link
                to="/"
                className="mt-8 inline-block font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
              >
                &larr; Back to the homepage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
