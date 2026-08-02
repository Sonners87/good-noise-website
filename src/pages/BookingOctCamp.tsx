import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"
import WorkshopInfoCard from "../components/WorkshopInfoCard"

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
          <h2 className="font-display max-w-2xl text-3xl leading-[0.98] text-ink sm:text-4xl">
            A Quick Note Before You Book
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 md:text-lg">
            We give kids genuine choices throughout the two days — what they
            play, what they contribute, how involved they want to be —
            always within a structure Dave's actively guiding. That means
            the exact shape of each day can shift a little depending on the
            group. What we can promise is a safe, well-supported experience
            the whole way through, with Dave keeping things on track while
            still leaving room for kids to make it their own. Some of the
            best moments come from those small, unplanned bits of
            creativity.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24">
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
            Small-group workshops like this are hard to backfill on short
            notice — once someone drops out close to the date, there's
            rarely time to find a replacement. We appreciate your
            understanding.
          </p>
        </div>
      </section>

      <section className="bg-brand">
        <div className="mx-auto max-w-[1400px] px-5 py-16 text-center md:px-10 md:py-20">
          {/*
            Confirm in the Stripe dashboard that this Payment Link's
            post-payment redirect is set to /musician-intake, so buyers land
            straight on the intake form after paying.
          */}
          <PillButton href="https://buy.stripe.com/aFa6oH6ua1yoaXk8NZ3F601" variant="primary">
            Book &amp; pay
          </PillButton>
        </div>
      </section>

      <Footer />
    </>
  )
}
