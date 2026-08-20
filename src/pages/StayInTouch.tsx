import { useEffect } from "react"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import SubscribeForm from "../components/SubscribeForm"

const benefits = [
  "First to know when new workshops open — before we announce them publicly",
  "Early-bird pricing and priority access ahead of general release",
  "Occasional updates on the community as it grows — including parent programs we're planning",
  "Never spam, unsubscribe anytime",
]

export default function StayInTouch() {
  useEffect(() => {
    document.title = "Stay in Touch — Good Noise Project"
  }, [])

  return (
    <>
      <PageHero>
        <h1 className="font-display max-w-2xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Be Part of Where This Goes Next
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Good Noise Project isn't a one-off program — it's the start of an ongoing
          community of young musicians in Perth. Saxophonists, shredding
          guitarists, singers, drummers — every instrument, every skill
          level, everyone welcome. We're growing this deliberately, over
          time. Sign up to be part of where it goes next.
        </p>

        <ul className="mt-8 max-w-md space-y-3">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 border-b border-white/15 pb-3 font-body text-base leading-relaxed text-white/85 last:border-b-0"
            >
              <span className="mt-1 text-terracotta" aria-hidden="true">
                &#9679;
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <SubscribeForm
            source="stay-in-touch-page"
            variant="landing"
            submitLabel="Join the Community"
          />
        </div>
      </PageHero>

      <Footer />
    </>
  )
}
