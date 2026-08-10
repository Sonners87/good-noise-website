import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import ContactForm from "../components/ContactForm"
import StayInLoop from "../components/StayInLoop"

export default function Contact() {
  useEffect(() => {
    document.title = "Contact — Good Noise Project"
  }, [])

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Contact
        </h1>
        <p className="font-body font-semibold mt-4 text-terracotta text-base md:text-lg">
          Still have questions?
        </p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
          Reach out — no question's too small, and getting in touch
          doesn't commit you to anything.
        </p>

        <ContactForm />
      </PageHero>

      <StayInLoop source="stay-in-loop-block" />
      <Footer />
    </>
  )
}
