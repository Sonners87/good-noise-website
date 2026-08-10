import { useEffect } from "react"
import { Link } from "react-router-dom"
import PageHero from "../components/PageHero"
import Footer from "../components/Footer"
import WorkshopCard from "../components/WorkshopCard"
import { workshops, workshopWhoFor } from "../content/workshops"
import { workshopCardPhotos } from "../content/workshopCardPhotos"
import { SHOW_OCT_2026_CAMP } from "../content/featureFlags"

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

  const musicMakersSpring = workshops["2026-spring-holidays"]
  const songwritingOct = SHOW_OCT_2026_CAMP ? workshops["songwriting-oct-2026"] : undefined

  return (
    <>
      <PageHero>
        <h1 className="font-display text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          A Few Ways to Make Good Noise
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          Here's what's on, and what's coming — running an in-school
          program? See our{" "}
          <Link to="/for-schools" className="font-semibold underline decoration-2 underline-offset-4 hover:text-terracotta">
            For Schools
          </Link>{" "}
          page.
        </p>
      </PageHero>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <WorkshopCard
              status="live"
              href={`/workshops/${musicMakersSpring.slug}`}
              title={musicMakersSpring.title}
              blurb={musicMakersSpring.teaser}
              whoFor={workshopWhoFor(musicMakersSpring.slug)}
              photoSrc={workshopCardPhotos[musicMakersSpring.slug].src}
              photoAlt={workshopCardPhotos[musicMakersSpring.slug].alt}
              photoObjectPosition={workshopCardPhotos[musicMakersSpring.slug].objectPosition}
            />

            {songwritingOct && (
              <WorkshopCard
                status="live"
                href={`/workshops/${songwritingOct.slug}`}
                title={songwritingOct.title}
                blurb={songwritingOct.teaser}
                whoFor={workshopWhoFor(songwritingOct.slug)}
                photoSrc={workshopCardPhotos[songwritingOct.slug].src}
                photoAlt={workshopCardPhotos[songwritingOct.slug].alt}
                photoObjectPosition={workshopCardPhotos[songwritingOct.slug].objectPosition}
              />
            )}

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
