import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import CampSignupForm from "../components/CampSignupForm"

export default function Book() {
  useEffect(() => {
    document.title = "Book Your Place — Good Noise Project"
  }, [])

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
      </PageHero>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start md:gap-16">
            {/* Left column: what they're paying for, then the form itself. */}
            <div className="flex flex-col gap-8">
              <div className="rounded-xl border-2 border-ink bg-cream p-6 md:p-8">
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
                    <span className="font-display rounded-md bg-terracotta px-4 py-2 text-xl text-white">
                      $195.00
                    </span>
                  </div>
                </div>
              </div>

              <CampSignupForm
                campLabel="September 2026 (30 Sep – 1 Oct)"
                stripeUrl="https://buy.stripe.com/cNi28r4m2cd28Pc5BN3F600"
              />
            </div>

            {/* Right column: sets expectations before they commit. */}
            <div>
              <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-ink sm:text-5xl">
                A Quick Note Before You Book
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                We run this loose, on purpose — participants make most of
                the calls on how the two days unfold. That means we can't
                guarantee exactly what will happen, or promise a specific
                outcome. What we can promise is a safe, well-run experience
                that stays flexible enough to follow what's actually
                happening in the room, rather than forcing a plan that
                isn't working. Some of the best moments come from what
                wasn't scripted.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
