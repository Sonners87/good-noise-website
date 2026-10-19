import PhotoImage from "./PhotoImage"
import dropIn from "../assets/images/after-school-tailored.webp"
import writing from "../assets/images/after-school-eight-week.webp"
import jamSession from "../assets/images/hero-guitar-jam.webp"

const pillars = [
  {
    title: "No Judgement",
    body: "We embrace mistakes — that's where the good stuff comes from.",
    photo: dropIn,
    alt: "Two young musicians talking beside a saxophone on a music stand and a blue electric guitar",
  },
  {
    title: "No Hierarchy",
    body: "Nobody's here to perform, prove themselves, or hit a benchmark.",
    photo: jamSession,
    alt: "A Good Noise facilitator laughing as he plays acoustic guitar with young musicians on keyboard, guitar and electric guitar in a studio jam session",
  },
  {
    title: "No Pressure",
    body: "Share when you're ready — not a moment before.",
    photo: writing,
    alt: "Two young musicians sitting on a rug in a jam room, smiling as they write lyrics on sheets of paper",
  },
]

export default function SafetyFirst() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="py-16 md:py-24">
          <h2 className="font-display max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            Here to Play, Not to Prove.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
            Every participant of a Good Noise Project workshop is treated the same,
            regardless of skill, background, or how long they've been
            playing. No judgement. No hierarchy. And no pressure to share
            before you're ready.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-cream/15 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="border-b border-cream/15 py-10 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <h3 className="font-display text-xl">{pillar.title}</h3>
              <PhotoImage
                src={pillar.photo}
                alt={pillar.alt}
                aspect="aspect-[4/3]"
                className="mt-6"
              />
              <p className="mt-5 text-sm leading-relaxed text-cream/70">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
