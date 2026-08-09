import PhotoImage from "./PhotoImage"
import Eyebrow from "./Eyebrow"
import WorkshopInfoCard from "./WorkshopInfoCard"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"
import jamInstrumentsPhoto from "../assets/images/workshop-jam-instruments.jpg"

export default function UpcomingWorkshop() {
  const workshop = workshops[upcomingWorkshopSlug]

  return (
    <section id="workshops" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-12">
          <div className="flex flex-col">
            <Eyebrow tone="onBlue" className="mb-4 self-start">
              What's coming up
            </Eyebrow>

            <h2 className="font-display mb-6 text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
              2026 Spring Holidays Jam Program
            </h2>

            <p className="mb-8 text-base leading-relaxed text-white/85 md:text-lg">
              {workshop.teaser}
            </p>

            <PhotoImage
              src={jamInstrumentsPhoto}
              alt="Silhouetted hands holding guitars, a bass, a keyboard, a cymbal and microphones up against the sky"
              aspect="aspect-[16/9]"
              objectPosition="center 80%"
              className="border-2 border-white/15"
            />
          </div>

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
    </section>
  )
}
