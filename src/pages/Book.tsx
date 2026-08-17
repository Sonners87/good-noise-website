import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import CampSignupForm from "../components/CampSignupForm"
import {
  currentStripeUrl,
  isEarlyBirdActive,
  STANDARD_PRICE_DOLLARS,
  EARLY_BIRD_PRICE_DOLLARS,
} from "../content/pricing"

export default function Book() {
  useEffect(() => {
    document.title = "Book Your Place — Good Noise Project"
  }, [])

  const earlyBird = isEarlyBirdActive()

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
            stripeUrl={currentStripeUrl()}
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
                  {earlyBird && (
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-terracotta">
                      Early bird
                    </span>
                  )}
                  <span className="font-display flex items-center gap-2 bg-terracotta px-4 py-2 text-xl text-white">
                    {earlyBird && (
                      <span className="text-white/60 line-through">
                        ${STANDARD_PRICE_DOLLARS}.00
                      </span>
                    )}
                    <span>
                      ${earlyBird ? EARLY_BIRD_PRICE_DOLLARS : STANDARD_PRICE_DOLLARS}.00
                    </span>
                  </span>
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
