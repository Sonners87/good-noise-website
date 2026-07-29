import ContactForm from "./ContactForm"

export default function GetInvolvedForm() {
  return (
    <section id="contact" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Ready to Get Involved?
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg">
          Send us a message and we'll get back to you about workshops, dates,
          and how to get your kid — or yourself — involved.
        </p>

        <ContactForm />
      </div>
    </section>
  )
}
