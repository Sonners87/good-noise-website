// Not linked anywhere in site nav or other pages by design — reached via
// the redirect URL configured on the Stripe Payment Link (see the
// "Book & pay" button comment in Booking.tsx) after a successful payment.

import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MusicianIntakeForm from "../components/MusicianIntakeForm"

export default function MusicianIntake() {
  useEffect(() => {
    document.title = "Tell Us About Your Musician — Good Noise Project"
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-brand">
        <Header />

        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-4 md:px-10 md:pb-24">
          <h1 className="font-display max-w-2xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            Tell Us About Your Musician
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
            Please fill this out with your young person, or have them do so
            themselves — it's important nothing's guessed, assumed, or
            submitted with even a small question mark attached.
          </p>

          <MusicianIntakeForm />
        </div>
      </section>

      <Footer />
    </>
  )
}
