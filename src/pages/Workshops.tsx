import { useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WorkshopCard from "../components/WorkshopCard"
import { workshops } from "../content/workshops"
import workshopPhoto from "../assets/images/workshop-band-trio.webp"
import acousticBoyPhoto from "../assets/images/strip-acoustic-boy.webp"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"

function whoFor(slug: string): string {
  return workshops[slug].infoRows.find((row) => row.label === "Who")?.value ?? ""
}

// Placeholder cards for formats that don't exist yet — draft copy, review
// before this goes live.
const comingSoon = [
  {
    title: "A Workshop for Dads",
    blurb: "For dads who play — or used to — to pick it back up and make music with other dads.",
    whoFor: "Dads",
    figure: "guitarist" as const,
  },
  {
    title: "Primary School Songwriting Workshop",
    blurb: "A gentler, more playful introduction to writing and making music together, built for younger kids.",
    whoFor: "Primary school students",
    figure: "singer" as const,
  },
]

export default function Workshops() {
  useEffect(() => {
    document.title = "Workshops — Good Noise Project"
  }, [])

  const songwritingSep = workshops["songwriting-sep-2026"]
  const songwritingOct = workshops["songwriting-oct-2026"]
  const inSchool = workshops["in-school-songwriting"]

  return (
    <>
      <section className="bg-brand">
        <Header />
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-4 md:px-10 md:pb-24">
          <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            A Few Ways to Make Good Noise
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
            From weekend workshops to in-school programs — here's what's on,
            and what's coming.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <WorkshopCard
              status="live"
              href={`/workshops/${songwritingSep.slug}`}
              title={songwritingSep.title}
              blurb={songwritingSep.teaser}
              whoFor={whoFor(songwritingSep.slug)}
              photoSrc={workshopPhoto}
              photoAlt="Three young musicians performing together, two playing guitar and one singing into a microphone"
            />

            <WorkshopCard
              status="live"
              href={`/workshops/${songwritingOct.slug}`}
              title={songwritingOct.title}
              blurb={songwritingOct.teaser}
              whoFor={whoFor(songwritingOct.slug)}
              photoSrc={bandPracticePhoto}
              photoAlt="Two young musicians at band practice, one playing electric guitar and singing into a microphone"
            />

            <WorkshopCard
              status="live"
              href={`/workshops/${inSchool.slug}`}
              title={inSchool.title}
              blurb={inSchool.teaser}
              whoFor={whoFor(inSchool.slug)}
              photoSrc={acousticBoyPhoto}
              photoAlt="A teenage boy playing acoustic guitar on stage"
            />

            {comingSoon.map((card) => (
              <WorkshopCard
                key={card.title}
                status="comingSoon"
                title={card.title}
                blurb={card.blurb}
                whoFor={card.whoFor}
                figure={card.figure}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
