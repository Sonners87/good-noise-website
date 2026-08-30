import { Link } from "react-router-dom"

export default function IntroSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <h2 className="font-display mb-8 max-w-2xl text-4xl leading-[0.98] text-ink sm:text-5xl">
          Find Your People.
          <br />
          Find Your Sound.
        </h2>

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
          <p>
            Our next one is a{" "}
            <Link
              to="/school-holiday-music-camp-perth"
              className="font-semibold text-terracotta underline decoration-2 underline-offset-4 hover:text-ink"
            >
              school holiday music camp
            </Link>{" "}
            in North Perth this Spring — two days of writing, jamming and
            performing an original song together.
          </p>
        </div>
      </div>
    </section>
  )
}
