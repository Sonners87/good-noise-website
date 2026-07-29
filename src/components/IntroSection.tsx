import PhotoStrip from "./PhotoStrip"

export default function IntroSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-ink/15 px-5 py-4 text-xs font-semibold tracking-wide text-ink/70 md:px-10">
        <span>Social enterprise</span>
        <span className="hidden sm:inline">Est. 2026</span>
        <span>Perth, WA</span>
      </div>

      <PhotoStrip />

      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <div className="order-2 space-y-5 text-base leading-relaxed text-ink/80 md:order-1 md:text-lg">
            <p>
              Good Noise Project is a Perth-based social enterprise built
              around one idea: using music to help youth find their people.
              Music isn't something to sit back and listen to — played
              together, it becomes something you make, something you share,
              and something that connects you to whoever's in the room with
              you, from the stage to the crowd.
            </p>
            <p>
              This program exists to give young people that experience: the
              chance to create, collaborate and connect through music,
              without the pressure of a stage or a standard to meet. We
              don't follow traditional music lessons, and while there's
              something genuinely therapeutic in what happens here, we're
              not a professional therapy practice.
            </p>
          </div>

          <h2 className="font-display order-1 text-4xl leading-[0.98] text-ink sm:text-5xl md:order-2 md:text-6xl">
            Music Is the Vehicle. Play Is the Action. Connection Is the
            Outcome.
          </h2>
        </div>
      </div>
    </section>
  )
}
