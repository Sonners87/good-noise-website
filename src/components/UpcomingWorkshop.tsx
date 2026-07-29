import PhotoImage from "./PhotoImage"
import Eyebrow from "./Eyebrow"
import WorkshopInfoCard from "./WorkshopInfoCard"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"
import workshopPhoto from "../assets/images/workshop-band-trio.webp"

export default function UpcomingWorkshop() {
  const workshop = workshops[upcomingWorkshopSlug]

  return (
    <section id="workshops" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onBlue">What's coming up</Eyebrow>

        <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Songwriting Workshop | Sep 2026
        </h2>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
          {workshop.teaser}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
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

          <PhotoImage
            src={workshopPhoto}
            alt="Three young musicians performing together, two playing guitar and one singing into a microphone"
            aspect="aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  )
}
