import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import CampSignupForm from "../components/CampSignupForm"
import SubscribeForm from "../components/SubscribeForm"
import PillButton from "../components/PillButton"
import { workshops } from "../content/workshops"
import { STRIPE_URL, PRICE_DOLLARS } from "../content/pricing"
import { trackMetaEvent } from "../lib/metaPixel"

export default function Book() {
  // Nothing links here while the program is full — the workshop page's CTAs
  // all point at its waitlist instead — but the route stays live for anyone
  // arriving from an old ad, email or bookmark, so it has to answer for
  // itself rather than show a working checkout form.
  const soldOut = workshops["2026-spring-holidays"].soldOut

  useEffect(() => {
    document.title = soldOut
      ? "This Program Is Full — Good Noise Project"
      : "Book Your Place — Good Noise Project"
  }, [soldOut])

  // Landing on this page is the start of checkout — the form here hands off
  // to Stripe. Fired on mount rather than on submit so it also counts
  // visitors who arrive with intent but drop out of the form, which is the
  // signal Meta optimises delivery against. Suppressed while the program is
  // full: there's no checkout to start, and counting these arrivals would
  // train delivery on a conversion that can't happen.
  useEffect(() => {
    if (soldOut) return
    trackMetaEvent("InitiateCheckout")
  }, [soldOut])

  if (soldOut) {
    return (
      <>
        <PageHero>
          <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            {soldOut.heading}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            {soldOut.body}
          </p>

          <div className="mt-10">
            <SubscribeForm
              source={soldOut.subscribeSource}
              variant="landing"
              submitLabel="Join the waitlist"
            />
          </div>

          <div className="mt-10">
            <PillButton href="/workshops/2026-spring-holidays" variant="onBlue">
              Back to the program details
            </PillButton>
          </div>
        </PageHero>

        <Footer />
      </>
    )
  }

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Book Your Place
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Fill this out with your young person — a few details about them,
          a few about you, then through to payment.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <CampSignupForm
            campLabel="September 2026 (30 Sep – 1 Oct)"
            stripeUrl={STRIPE_URL}
          />

          <div className="border-2 border-ink bg-cream p-6 md:p-8">
            <span className="font-body font-bold text-xs uppercase tracking-wide text-ink/60">
              Order Summary
            </span>

            <p className="font-display mt-6 text-2xl uppercase leading-[0.98] text-terracotta sm:text-3xl">
              2026 Spring Holidays Jam Program
            </p>
            <p className="font-display mt-2 text-xl uppercase leading-[0.98] text-ink sm:text-2xl">
              30 Sep – 1 Oct, 2026
            </p>
            <p className="mt-2 font-body text-base text-ink/60">
              9am – 3pm each day
            </p>

            <div className="mt-6 border-t border-ink/15 pt-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-body font-bold uppercase tracking-wide text-ink">
                  Total Cost
                </span>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-terracotta">
                    Foundation Price · Our First Program
                  </span>
                  <span className="font-display bg-terracotta px-4 py-2 text-xl text-white">
                    ${PRICE_DOLLARS}.00
                  </span>
                  <span className="font-body text-xs text-ink/60">for both days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHero>

      <Footer />
    </>
  )
}
