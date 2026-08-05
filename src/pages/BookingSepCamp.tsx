import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import CampSignupForm from "../components/CampSignupForm"

const whatToBring = [
  "Your instrument (range of instruments available)",
  "Water bottle",
  "Packed lunch & snacks each day",
  "Earplugs (if sensitive to noise)",
]

export default function BookingSepCamp() {
  useEffect(() => {
    document.title = "Book — September Songwriting Camp — Good Noise Project"
  }, [])

  return (
    <>
      <section className="bg-brand">
        <Header />
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-4 md:px-10 md:pb-24">
          <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            Good Noise Songwriting Camp
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            Two days. One song. A room full of young musos who've never met
            before.
          </p>

          <div className="mt-10 max-w-md">
            <WorkshopInfoCard
              rows={[
                { label: "Cost", value: "$195" },
                {
                  label: "Dates",
                  value: "30 September – 1 October (September school holidays)",
                },
                {
                  label: "Location",
                  value: "5 Woodville Lane, North Perth WA 6006",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 md:items-start">
            {/* Left column: what to expect, what to bring, and cancellation
                terms — everything a parent needs to read before filling in
                the form on the right. */}
            <div className="flex flex-col gap-14">
              <div>
                <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
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

              <div>
                <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
                  What to Bring
                </h2>
                <ul className="mt-6 max-w-md space-y-3">
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

              <div>
                <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
                  Cancellations &amp; Refunds
                </h2>

                <div className="mt-8 max-w-md">
                  <WorkshopInfoCard
                    rows={[
                      { label: "More than two weeks' notice", value: "Full refund" },
                      { label: "1–2 weeks' notice", value: "50% refund" },
                      { label: "Less than one week's notice", value: "No refund" },
                    ]}
                  />
                </div>

                <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
                  Small-group workshops like this are hard to backfill on
                  short notice — once someone drops out close to the date,
                  there's rarely time to find a replacement. We appreciate
                  your understanding.
                </p>
              </div>
            </div>

            {/* Right column: signup form. Submitting saves the participant
                and parent details via Netlify Forms, then sends the buyer on
                to Stripe to pay. */}
            <div className="md:sticky md:top-8">
              <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
                Sign Up
              </h2>
              <div className="mt-6">
                {/*
                  Confirm in the Stripe dashboard that this Payment Link's
                  post-payment redirect no longer points to /musician-intake
                  — that intake info is now collected by this form before
                  payment.
                */}
                <CampSignupForm
                  campLabel="September 2026 (30 Sep – 1 Oct)"
                  stripeUrl="https://buy.stripe.com/cNi28r4m2cd28Pc5BN3F600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
