import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ContactForm from "../components/ContactForm"

export default function Contact() {
  useEffect(() => {
    document.title = "Contact — Good Noise Project"
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-brand">
        <Header />

        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-4 md:px-10 md:pb-24">
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
        </div>
      </section>

      <Footer />
    </>
  )
}
