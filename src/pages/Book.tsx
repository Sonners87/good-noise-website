import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import CampSignupForm from "../components/CampSignupForm"

// Just the form — no dates/cost/location/what-to-expect/cancellation copy.
// That all lives on the workshop's Info page (WorkshopDetail.tsx), which is
// where visitors land before clicking through here to book.
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
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
          Fill this out with your young person — a few details about them,
          a few about you, then through to payment.
        </p>

        <div className="mt-10 max-w-xl">
          <CampSignupForm
            campLabel="September 2026 (30 Sep – 1 Oct)"
            stripeUrl="https://buy.stripe.com/cNi28r4m2cd28Pc5BN3F600"
          />
        </div>
      </PageHero>

      <Footer />
    </>
  )
}
