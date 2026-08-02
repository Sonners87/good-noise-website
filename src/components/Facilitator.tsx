import PhotoImage from "./PhotoImage"
import PillButton from "./PillButton"
import Eyebrow from "./Eyebrow"
import FacilitatorContact from "./FacilitatorContact"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"

export default function Facilitator() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <Eyebrow tone="onLight">Meet the facilitator</Eyebrow>

          <h2 className="font-display text-4xl leading-[0.98] text-ink sm:text-5xl">
            Dave Sonntag
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
            Good Noise Project is run by Dave Sonntag — a drummer of thirty years, a
            self-taught singer-songwriter, and a dedicated mentor to young
            people.
          </p>

          <FacilitatorContact className="mt-6" />

          <PillButton href="/about" variant="onLight" className="mt-9">
            Read Dave's story
          </PillButton>
        </div>

        <PhotoImage
          src={facilitatorPhoto}
          alt="Dave Sonntag smiling, sitting on a rooftop ledge in Perth"
          aspect="aspect-[4/5]"
          objectPosition="center 20%"
        />
      </div>
    </section>
  )
}
