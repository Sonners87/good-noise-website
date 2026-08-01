import PhotoImage from "./PhotoImage"
import concertFriends from "../assets/images/strip-concert-friends.webp"
import drummer from "../assets/images/strip-drummer.webp"
import busker from "../assets/images/strip-busker.webp"

const pillars = [
  {
    title: "No Judgement",
    body: "We embrace mistakes — that's where the good stuff comes from.",
    photo: concertFriends,
    alt: "A group of teenage girls laughing together in a crowd",
  },
  {
    title: "No Hierarchy",
    body: "Nobody's here to perform, prove themselves, or hit a benchmark.",
    photo: drummer,
    alt: "A young drummer performing under green stage light",
  },
  {
    title: "No Pressure",
    body: "Share when you're ready — not a moment before.",
    photo: busker,
    alt: "A young woman singing into a microphone while playing acoustic guitar",
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
            Every participant of a Good Noise workshop is treated the same,
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
