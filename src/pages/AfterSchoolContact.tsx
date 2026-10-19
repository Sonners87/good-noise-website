import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import AfterSchoolForm from "../components/afterschool/AfterSchoolForm"
import { setLandingPageMeta } from "../lib/pageMeta"

const PAGE_TITLE = "Enquire About an After-School Program | Good Noise Project"
const PAGE_DESCRIPTION = "Enquire about a Good Noise Project after-school music program for your community, council, school or youth organisation."

export default function AfterSchoolContact() {
  useEffect(() => {
    setLandingPageMeta(PAGE_TITLE, PAGE_DESCRIPTION, { canonicalPath: "/after-school-programs/contact" })
  }, [])

  return (
    <>
      <section className="bg-[var(--gn-pink)] text-ink">
        <Header tone="onLight" />
        <div className="mx-auto max-w-[1400px] px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-16">
          <span className="gn-eyebrow text-ink">After-School Programs</span>
          <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
            Enquire about an after-school program for your community or school
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/85 md:text-lg">
            Fill out the form and we'll get back to you ASAP.
          </p>
          <AfterSchoolForm
            formName="after-school-enquiry"
            messageLabel="Please tell us a little about your organisation or school"
            messageRequired={true}
            messagePlaceholder="Who are the young people, roughly how many and what ages? Where would the program run, and when are you hoping to start?"
            submitLabel="Send enquiry"
            successMessage="Thanks! We'll get back to you in no time."
          />
        </div>
      </section>
      <Footer />
    </>
  )
}
