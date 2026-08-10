import Eyebrow from "./Eyebrow"
import WorkshopInfoCard from "./WorkshopInfoCard"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"

export default function UpcomingWorkshop() {
  const workshop = workshops[upcomingWorkshopSlug]

  return (
    <section id="workshops" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex max-w-2xl flex-col">
          <Eyebrow tone="onBlue" className="mb-4 self-start">
            What's coming up
          </Eyebrow>

          <h2 className="font-display mb-6 text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
            2026 Spring Holidays Jam Program
          </h2>

          <p className="mb-8 text-base leading-relaxed text-white/85 md:text-lg">
            A two-day jam program where you'll write an original song together with
            other young musos — lyrics, melody, harmonies, chords, the lot. No
            judgement, no benchmarks, just good vibes and awesome connections.
          </p>

          <div className="max-w-md">
            <WorkshopInfoCard
              title={workshop.shortTitle}
              rows={[
                { label: "Dates", value: workshop.dates ?? "" },
                { label: "Ages", value: "14-17" },
                { label: "Location", value: workshop.location ?? "" },
              ]}
              ctaLabel="View workshop details"
              ctaHref={`/workshops/${workshop.slug}`}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
