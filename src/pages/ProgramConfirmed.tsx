// Shown after a successful Stripe payment (the Payment Link's confirmation
// URL points here). Driven by the program's config; the same message goes out
// as an email from netlify/functions/stripe-webhook.js — keep the two in sync.
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import NotFound from "./NotFound"
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
    const sessionId = new URLSearchParams(window.location.search).get("session_id") ?? undefined
    trackMetaEvent("Purchase", { value: p.priceDollars, currency: "AUD" }, sessionId)
    return () => robots.remove()
  }, [p])

  if (!p) return <NotFound />

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          You're in! Welcome to the band.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Hey there, you're officially locked in for Good Noise Project's {p.name}! I'm so excited
          to have you on board.
        </p>
      </PageHero>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-12">
            <div>
              <h2 className="font-display text-2xl leading-[0.98] text-ink sm:text-3xl">
                Here's What You Need to Know
              </h2>
              <h3 className="mt-9 font-body text-xs font-bold uppercase tracking-wide text-ink/60">
                What to Bring Each Day
              </h3>
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
              <p className="mt-8 font-body text-base leading-relaxed text-ink/80 md:text-lg">
                The {p.daysWord} are all about fun, creativity and good vibes. There's no pressure —
                just {p.daysWord} of jamming, creating music and finding some likeminded musos to
                make noise with.
              </p>
            </div>

            <WorkshopInfoCard
              title="Event Details"
              rows={[
                { label: "When", value: `${p.dates}\n${p.time}` },
                { label: "Where", value: p.venueLine },
              ]}
            />
          </div>

          <div className="mt-16 max-w-xl border-t-2 border-ink/15 pt-10">
            <p className="font-body text-base leading-relaxed text-ink/80 md:text-lg">
              I'll be in touch closer to the date with any last bits of info you need. In the
              meantime, if you've got questions, just reply to your confirmation email or reach me
              directly:
            </p>
            <FacilitatorContact className="mt-6" />
            <p className="mt-8 font-body text-base leading-relaxed text-ink/80 md:text-lg">
              Can't wait to see you in the room.
            </p>
            <p className="font-display mt-6 text-2xl text-terracotta">Dave</p>
            <p className="font-body text-sm text-ink/60">Good Noise Project</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
