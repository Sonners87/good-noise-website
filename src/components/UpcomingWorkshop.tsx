import PhotoImage from "./PhotoImage"
import Eyebrow from "./Eyebrow"
import WorkshopInfoCard from "./WorkshopInfoCard"
import { workshops, upcomingWorkshopSlug } from "../content/workshops"
import guitaristSagePhoto from "../assets/images/workshop-guitarist-sage.webp"

export default function UpcomingWorkshop() {
  const workshop = workshops[upcomingWorkshopSlug]

  return (
    <section id="workshops" className="relative overflow-hidden bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onBlue">What's coming up</Eyebrow>

        <h2 className="font-display max-w-3xl text-4xl leading-[0.98] text-white sm:text-5xl md:text-6xl">
          Spring Holidays Music Program
        </h2>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-6">
            <p className="text-base leading-relaxed text-white/85 md:text-lg">
              {workshop.teaser}
            </p>

            <PhotoImage
              src={guitaristSagePhoto}
              alt="Silhouette of a teenage musician holding an electric guitar and singing into a microphone, lit sage-green on stage"
              aspect="aspect-[16/9]"
              objectPosition="center 30%"
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
