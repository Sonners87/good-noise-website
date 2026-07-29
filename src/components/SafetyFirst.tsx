import PhotoImage from "./PhotoImage"
import buskingGirl from "../assets/images/strip-busking-girl.webp"
import drummer from "../assets/images/strip-drummer.webp"
import recordStore from "../assets/images/strip-record-store.webp"

const pillars = [
  {
    title: "No Judgement",
    body: "Every participant is treated the same, regardless of skill, background, or how long they've been playing.",
    photo: buskingGirl,
    alt: "A young girl singing passionately while playing a pink guitar",
  },
  {
    title: "No Hierarchy",
    body: "Nobody's here to perform, prove themselves, or hit a benchmark.",
    photo: drummer,
    alt: "A young drummer performing under green stage light",
  },
  {
    title: "No Pressure",
    body: "No pressure to share before you're ready.",
    photo: recordStore,
    alt: "A teenager browsing vinyl records in a record store",
  },
]

export default function SafetyFirst() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="py-16 md:py-24">
          <h2 className="font-display max-w-4xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
            Nobody's Here to Perform, Prove Themselves, or Hit a Benchmark.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-cream/75 md:text-lg">
            Every participant is treated the same, regardless of skill,
            background, or how long they've been playing. No judgement. No
            hierarchy. No pressure to share before you're ready.
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
