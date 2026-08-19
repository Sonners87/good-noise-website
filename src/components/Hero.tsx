import { Link } from "react-router-dom"
import PhotoImage from "./PhotoImage"
import Header from "./Header"
import heroPhoto from "../assets/images/hero-sunset-friends.webp"

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

        <div className="relative min-h-[320px] md:min-h-0">
          {/* .gn-photo-frame's offset shadow needs its own wrapper: PhotoImage's
              own div is overflow-hidden (to clip the zoomed image), which would
              clip the shadow too if it lived on the same element. h-[calc(100%-6px)]
              (not h-full + margin-bottom — height:100% ignores margin and just
              overflows the parent instead of leaving a gap above it) plus
              mr-[6px] (auto-width block, so margin *does* shrink it here) leaves
              the outer section's overflow-hidden room to not clip the shadow. */}
          <div className="gn-photo-frame mr-[6px] h-[calc(100%-6px)]">
            <PhotoImage
              src={heroPhoto}
              alt="A group of young musicians laughing together outdoors at sunset, one holding an acoustic guitar"
              aspect="aspect-auto"
              className="h-full"
              objectPosition="65% 38%"
              tint
              zoom
            />
          </div>
        </div>
      </div>
    </section>
  )
}
