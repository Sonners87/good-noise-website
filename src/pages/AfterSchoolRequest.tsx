import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import AfterSchoolForm from "../components/afterschool/AfterSchoolForm"
import { setLandingPageMeta } from "../lib/pageMeta"

const PAGE_TITLE = "Request an After-School Info Pack | Good Noise Project"
const PAGE_DESCRIPTION = "Request the Good Noise Project after-school programs info pack for your council, school or youth organisation."

export default function AfterSchoolRequest() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, { canonicalPath: "/after-school-programs/request" })
  }, [])

  return (
    <>
      <section className="bg-[var(--gn-pink)] text-ink">
        <Header tone="onLight" />
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
          <span className="gn-eyebrow text-ink">After-School Programs</span>
          <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
            Request an info pack
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/85 md:text-lg">
            Fill out the form and we'll get back to you with an info pack ASAP.
          </p>
          <AfterSchoolForm
            formName="after-school-info-pack"
            messageLabel="Anything else you need from us? (optional)"
            messageRequired={false}
            messagePlaceholder="Questions about programs, timing, age brackets, venues... ask them here."
            submitLabel="Request the info pack"
            successMessage="Thanks. We'll get back to you with the info pack soon."
          />
        </div>
      </section>
      <Footer />
    </>
  )
}
