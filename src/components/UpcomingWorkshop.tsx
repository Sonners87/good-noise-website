import PhotoImage from "./PhotoImage"
import Eyebrow from "./Eyebrow"
import WorkshopInfoCard from "./WorkshopInfoCard"
import { workshops, upcomingWorkshopSlugs } from "../content/workshops"
import workshopPhoto from "../assets/images/workshop-band-trio.webp"
import bandPracticePhoto from "../assets/images/hero-band-practice.webp"

// Per-slug hero imagery for this section — mirrors the map in
// WorkshopDetail.tsx since these are the same photos, just shown smaller.
const heroPhotos: Record<string, { src: string; alt: string }> = {
  "songwriting-sep-2026": {
    src: workshopPhoto,
    alt: "Three young musicians performing together, two playing guitar and one singing into a microphone",
  },
  "songwriting-oct-2026": {
    src: bandPracticePhoto,
    alt: "Two young musicians at band practice, one playing electric guitar and singing into a microphone",
  },
}

export default function UpcomingWorkshop() {
  return (
    <section id="workshops" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onBlue">What's coming up</Eyebrow>

        <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Good Noise Songwriting Camps | Sep &amp; Oct 2026
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
          {upcomingWorkshopSlugs.map((slug) => {
            const workshop = workshops[slug]
            const photo = heroPhotos[slug]

            return (
              <div key={slug}>
                <p className="text-base leading-relaxed text-white/85 md:text-lg">
                  {workshop.teaser}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5">
                  {photo && (
                    <PhotoImage
                      src={photo.src}
                      alt={photo.alt}
                      aspect="aspect-[16/9]"
                      objectPosition="center 30%"
                      className="border-2 border-white/15"
                    />
                  )}

                  <WorkshopInfoCard
                    title={workshop.shortTitle}
                    rows={[
                      { label: "Dates", value: workshop.dates ?? "" },
                      { label: "Cost", value: workshop.price ?? "" },
                      { label: "Location", value: workshop.location ?? "" },
                    ]}
                    ctaLabel="View workshop details"
                    ctaHref={`/workshops/${workshop.slug}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
