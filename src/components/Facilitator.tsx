import { Link } from "react-router-dom"
import PhotoImage from "./PhotoImage"
import FacilitatorContact from "./FacilitatorContact"
import facilitatorPhoto from "../assets/images/facilitator-dave.webp"

export default function Facilitator() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div>
          <span className="gn-eyebrow text-[var(--gn-ink)]">Meet the facilitator</span>

          <h2 className="font-display mt-4 text-4xl leading-[0.98] text-ink sm:text-5xl">
            Dave Sonntag
          </h2>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
            Good Noise Project is run by Dave Sonntag — a drummer of thirty years, a
            self-taught singer-songwriter, and a dedicated mentor to young
            people.
          </p>

          <FacilitatorContact className="mt-6" />

          <Link to="/about" className="gn-btn-secondary mt-9 text-[13px]">
            Read Dave's story &rarr;
          </Link>
        </div>

        <PhotoImage
          src={facilitatorPhoto}
          alt="Dave Sonntag playing acoustic guitar and singing into a microphone outdoors"
          aspect="aspect-[4/5]"
          objectPosition="center 20%"
        />
      </div>
    </section>
  )
}
