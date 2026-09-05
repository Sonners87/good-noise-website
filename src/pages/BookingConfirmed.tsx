import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import FacilitatorContact from "../components/FacilitatorContact"
import { trackMetaEvent } from "../lib/metaPixel"
import { PRICE_DOLLARS } from "../content/pricing"
import { markCheckoutStarted } from "../lib/bookingIntent"

const WHAT_TO_BRING = [
  "Instrument (we've also got a range on hand)",
  "A water bottle",
  "Packed lunch & snacks (fridge available)",
  "Earplugs (if sensitive to noise)",
]

// Shown after a successful Stripe payment — Stripe's Payment Link redirects
// here once checkout completes. Content is the static confirmation copy;
// the same message also goes out as an email via the stripe-webhook
// Netlify function, so keep the two in sync if this copy changes.
export default function BookingConfirmed() {
  useEffect(() => {
    document.title = "You're In — Good Noise Project"
  }, [])

  // Reaching this page means the booking is done — including for anyone who
  // paid via the Payment Link directly rather than through CampSignupForm.
  // Records the same flag that form does, so the workshop page's soft
  // "stay in the loop" offer never greets a visitor who has already booked.
  useEffect(() => {
    markCheckoutStarted()
  }, [])

  useEffect(() => {
    // Stripe's Payment Link redirects here once checkout completes, so this
    // mount is our signal a booking is done. If the Payment Link's
    // confirmation URL is configured (in the Stripe dashboard) to include
    // ?session_id={CHECKOUT_SESSION_ID}, that ID is reused as the event ID
    // so Meta can de-duplicate this against the matching server-side
    // Conversions API event fired from netlify/functions/stripe-webhook.js.
    const sessionId =
      new URLSearchParams(window.location.search).get("session_id") ?? undefined
    trackMetaEvent(
      "Purchase",
      { value: PRICE_DOLLARS, currency: "AUD" },
      sessionId,
    )
  }, [])

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          You're in! Welcome to the band.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Hey there, you're officially locked in for Good Noise Project's
          2026 Spring Holidays Jam Program! I'm so excited to have you on
          board.
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
                {WHAT_TO_BRING.map((item) => (
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
                The two days are all about fun, creativity and good vibes.
                There's no pressure — just two days of jamming, creating
                music and finding some likeminded musos to make noise with.
              </p>
            </div>

            <WorkshopInfoCard
              title="Event Details"
              rows={[
                {
                  label: "When",
                  value: "Wed, 30 Sep – Thu 1 Oct 2026\n9am – 3pm each day",
                },
                {
                  label: "Where",
                  value:
                    "Player 1 Music School\n5 Woodville Lane, North Perth WA 6006",
                },
              ]}
            />
          </div>

          <div className="mt-16 max-w-xl border-t-2 border-ink/15 pt-10">
            <p className="font-body text-base leading-relaxed text-ink/80 md:text-lg">
              I'll be in touch closer to the date with any last bits of
              info you need. In the meantime, if you've got questions,
              just reply to your confirmation email or reach me directly:
            </p>
            <FacilitatorContact className="mt-6" />

            <p className="mt-8 font-body text-base leading-relaxed text-ink/80 md:text-lg">
              Can't wait to see you in the room.
            </p>
            <p className="font-display mt-6 text-2xl text-terracotta">Dave</p>
            <p className="font-body text-sm text-ink/60">
              Good Noise Project
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
