import Header from "../components/Header"
import Footer from "../components/Footer"
import PillButton from "../components/PillButton"

export default function NotFound() {
  return (
    <>
      <div className="bg-brand">
        <Header />
      </div>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-24 text-center md:px-10 md:py-32">
          <h1 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
            That page doesn't exist, or has moved.
          </p>
          <PillButton href="/" variant="onLight" className="mt-9">
            Back to home
          </PillButton>
        </div>
      </section>

      <Footer />
    </>
  )
}
