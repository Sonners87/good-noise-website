import Eyebrow from "./Eyebrow"
import WorkshopCard from "./WorkshopCard"
import { workshops, upcomingWorkshopSlug, workshopWhoFor } from "../content/workshops"
import { workshopCardPhotos } from "../content/workshopCardPhotos"

// Reuses the exact same card as the Workshops pillar page, fed by the same
// `workshops` content — so editing a workshop's title/teaser/"Who" row
// automatically updates this section too, rather than maintaining separate
// copy here.
export default function UpcomingWorkshop() {
  const workshop = workshops[upcomingWorkshopSlug]
  const photo = workshopCardPhotos[upcomingWorkshopSlug]

  return (
    <section id="workshops" className="bg-brand">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onBlue" className="mb-8 self-start">
          What's coming up
        </Eyebrow>

        <div className="max-w-md">
          {/* The one featured card on the homepage — .gn-card, not
              -flat. !p-0 because Title/Photo/Details inside already carry
              their own padding; gn-card's own 22px would stack on top.
              gn-card-on-dark: this section is bg-brand (ink), where
              .gn-card's default ink-coloured shadow would be invisible
              against a matching ink background — see index.css. */}
          <WorkshopCard
            status="live"
            href={`/workshops/${workshop.slug}`}
            title={workshop.title}
            blurb={workshop.teaser}
            whoFor={workshopWhoFor(workshop.slug)}
            photoSrc={photo.src}
            photoAlt={photo.alt}
            photoObjectPosition={photo.objectPosition}
            className="gn-card gn-card-on-dark !p-0"
          />
        </div>
      </div>
    </section>
  )
}
