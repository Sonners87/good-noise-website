import PhotoImage from "./PhotoImage"
import PillButton from "./PillButton"
import Eyebrow from "./Eyebrow"
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
            <Eyebrow tone="onBlue">Community music workshops in Perth</Eyebrow>

            <h1 className="font-display text-white leading-[0.94] text-[13vw] md:text-[clamp(2.5rem,6vw,5.5rem)]">
              Music's Better Shared.
            </h1>

            <p className="font-body font-semibold mt-3 text-terracotta text-base md:text-lg">
              Inspiring young people to connect, create and find their voice
              through music. Less theory — more play.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <PillButton href="/workshops" variant="primary">
                See workshops
              </PillButton>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] md:min-h-0">
          <PhotoImage
            src={heroPhoto}
            alt="A group of young musicians laughing together outdoors at sunset, one holding an acoustic guitar"
            aspect="aspect-auto"
            className="h-full rounded-tl-[10rem] border-2 border-ink/20 md:rounded-tl-[14rem]"
            objectPosition="center 45%"
            tint
          />
        </div>
      </div>
    </section>
  )
}
