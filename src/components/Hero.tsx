import { Link } from "react-router-dom"
import PhotoImage from "./PhotoImage"
import Header from "./Header"
import heroPhoto from "../assets/images/hero-studio-group.webp"

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col overflow-hidden bg-brand"
    >
      <Header />

      <div className="grid w-full flex-1 grid-cols-1 md:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center py-14 pr-5 pl-[var(--edge-pad)] md:py-0 md:pr-8">
          <div className="relative max-w-2xl">
            <span className="gn-eyebrow text-[var(--gn-pink)]">
              Community music workshops in Perth
            </span>

            <h1 className="gn-heading-tilt font-display mt-4 text-white leading-[0.98] text-[13vw] md:text-[clamp(2.5rem,6vw,5.5rem)]">
              Music's <span className="gn-hl">Better</span>
              <br />
              Shared.
            </h1>

            <p className="font-body font-semibold mt-3 text-white/85 text-base md:text-lg">
              Inspiring young people to connect, create and find their voice
              through music.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/workshops" className="gn-btn-primary text-sm">
                See workshops &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex items-end pr-[6px] pb-[6px] pl-[var(--edge-pad)] md:pl-0">
          {/* Group shot with a dozen people edge to edge, so it's shown whole
              at its native ratio (no zoom, no cover-crop) and pinned to the
              screen's bottom-right corner instead of stretched to fill the
              column's full height. The 6px right/bottom padding keeps
              .gn-photo-frame's offset shadow inside the section's
              overflow-hidden. */}
          <div className="gn-photo-frame w-full">
            <PhotoImage
              src={heroPhoto}
              alt="A Good Noise workshop group of young musicians and facilitators smiling together in a studio, holding saxophones, a bass guitar and a microphone"
              aspect="aspect-[1900/1403]"
              tint
            />
          </div>
        </div>
      </div>
    </section>
  )
}
