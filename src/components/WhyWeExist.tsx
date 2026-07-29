import PhotoImage from "./PhotoImage"
import headphonesPhoto from "../assets/images/why-we-exist-headphones.webp"

const commitments = [
  "Playing beats listening. Every time.",
  "Safety doesn't happen by accident. We build it in.",
  "The best growth happens through freedom and play — not instruction.",
]

export default function WhyWeExist() {
  return (
    <section className="bg-cream">
      <div className="grid grid-cols-1 md:grid-cols-2 md:pr-[var(--edge-pad)]">
        <PhotoImage
          src={headphonesPhoto}
          alt="A teenage girl holding headphones next to an acoustic guitar"
          aspect="aspect-auto"
          className="min-h-[360px]"
          objectPosition="center 30%"
        />

        <div className="flex flex-col justify-center bg-brand py-14 pl-5 pr-5 text-white md:py-20 md:pl-12 md:pr-0">
          <div className="max-w-md">
            <h2 className="font-display text-4xl leading-[0.98] sm:text-5xl">
              Why We Exist
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
              A 2025 University of Sydney report found 43% of young
              Australians feel lonely. Music won't fix that on its own. But
              playing it together, with other people who get it — that's
              one of the most reliable ways humans have ever found their
              people.
            </p>

            <div className="mt-10">
              <span className="font-body font-bold text-base text-white/90">
                A few things we hold to:
              </span>
              <ul className="mt-4 space-y-3">
                {commitments.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-t border-white/20 pt-3 text-sm leading-snug text-white md:text-base"
                  >
                    <span className="font-body font-bold mt-0.5 shrink-0 text-terracotta">
                      ＋
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
