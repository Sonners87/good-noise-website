import PhotoImage from "./PhotoImage"
import headphonesPhoto from "../assets/images/why-we-exist-headphones.webp"

const commitments = [
  "Playing beats listening, every time.",
  "Safety doesn't happen by accident. We build it into every workshop.",
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
              Australians feel lonely<sup>1</sup>. Music won't fix that on
              its own. But playing music together is one of the most
              reliable ways humans have ever connected with others.
            </p>
            <p className="mt-2 text-xs text-white/50">
              1. https://www.sydney.edu.au/news-opinion/news/2025/08/04/more-than-40-percent-of-young-aussies-are-lonely-as-experts-call-for-national-loneliness-strategy.html
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
