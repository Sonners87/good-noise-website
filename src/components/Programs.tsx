import { Link } from "react-router-dom"
import PhotoImage from "./PhotoImage"
import Eyebrow from "./Eyebrow"
import { pillBaseStyles, pillSizeStyles, pillVariantStyles } from "./PillButton"
import programsPhoto from "../assets/images/hero-crowd-singer.webp"

export default function Programs() {
  return (
    <section className="bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onBlue">Programs</Eyebrow>

        <h2 className="font-display max-w-2xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          There's a Stage for Every Age.
        </h2>

        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
          From high schoolers writing their first song to dads picking up a
          guitar again — more Good Noise programs are on the way.
        </p>

        <Link
          to="/workshops"
          className="group relative mt-10 block overflow-hidden border-2 border-ink"
          aria-label="Explore Good Noise workshops"
        >
          <PhotoImage
            src={programsPhoto}
            alt="A young performer singing into a microphone in front of a cheering crowd"
            aspect="aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent transition group-hover:from-ink/95"
            aria-hidden="true"
          />

          <span
            className={`absolute bottom-6 left-6 md:bottom-10 md:left-10 ${pillBaseStyles} ${pillSizeStyles.md} ${pillVariantStyles.onBlue} group-hover:bg-terracotta group-hover:text-white group-hover:border-terracotta`}
          >
            Explore workshops
            <span aria-hidden="true">&rarr;</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
