import Eyebrow from "./Eyebrow"

export default function IntroSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onLight">Est. 2026 · Perth, WA</Eyebrow>

        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            Good Noise Project is a Perth-based social enterprise built
            around one idea: using music to help youth find their people.
            Music isn't something to sit back and listen to — played
            together, it becomes something you make, something you share,
            and something that connects you to whoever shares the room, from
            the stage to the crowd.
          </p>
          <p>
            These programs exist to give young people that experience: the
            chance to create, collaborate and connect through a range of
            songwriting and music workshops, without the pressure of a stage
            or a standard to meet. We don't provide traditional music
            lessons — we believe in learning by doing. And while there's
            something genuinely therapeutic in what happens here, we're not
            a professional therapy practice.
          </p>
        </div>

        <p className="font-body font-bold mt-8 max-w-3xl text-xl leading-snug text-ink md:text-2xl">
          Music Is the Vehicle. Play Is the Action. Connection Is the
          Outcome.
        </p>
      </div>
    </section>
  )
}
