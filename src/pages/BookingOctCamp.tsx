import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WorkshopInfoCard from "../components/WorkshopInfoCard"
import CampSignupForm from "../components/CampSignupForm"

const whatToExpect = [
  {
    bold: "Day 1 is all exploration",
    rest: " — trying instruments, finding a role in the group, shaping ideas together. No theory lessons, no sitting and listening.",
  },
  {
    bold: "Day 2 builds toward one thing",
    rest: ": performing the song they've written, together, for family and friends — in the same room they've spent two days in, not a formal stage.",
  },
  {
    bold: "No solo pressure",
    rest: " — nobody's singled out to perform alone or judged individually. It's a group effort from start to finish.",
  },
  {
    bold: "Small group size",
    rest: " — kept deliberately small so every voice actually gets heard, not lost in a crowd.",
  },
  {
    bold: "Facilitated the whole way through",
    rest: " by Dave — a working musician, not a classroom teacher running a lesson plan.",
  },
  {
    bold: "Parents/family are welcome for the final performance",
    rest: " at the end of day 2.",
  },
]

const whatToBring = [
  "Your instrument (range of instruments available)",
  "Water bottle",
  "Packed lunch & snacks each day",
  "Earplugs (if sensitive to noise)",
]

export default function BookingOctCamp() {
  useEffect(() => {
    document.title = "Book — October Songwriting Camp — Good Noise Project"
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
            Two days. One song. A room full of young musos meeting for the
            first time.
          </p>

          <div className="mt-10 max-w-md">
            <WorkshopInfoCard
              rows={[
                { label: "Cost", value: "$195" },
                {
                  label: "Dates",
                  value: "6–7 October (October school holidays)",
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
                  We give kids genuine choices throughout the two days — what
                  they play, what they contribute, how involved they want to
                  be — always within a structure Dave's actively guiding.
                  That means the exact shape of each day can shift a little
                  depending on the group. What we can promise is a safe,
                  well-supported experience the whole way through, with Dave
                  keeping things on track while still leaving room for kids
                  to make it their own. Some of the best moments come from
                  those small, unplanned bits of creativity.
                </p>
              </div>

              <div>
                <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
                  What to Expect
                </h2>
                <ul className="mt-6 max-w-2xl space-y-3">
                  {whatToExpect.map((item) => (
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
                  campLabel="October 2026 (6–7 Oct)"
                  stripeUrl="https://buy.stripe.com/aFa6oH6ua1yoaXk8NZ3F601"
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
