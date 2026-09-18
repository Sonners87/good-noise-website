import Eyebrow from "./Eyebrow"
import WorkshopCard from "./WorkshopCard"
import { workshops, upcomingWorkshopSlugs, workshopWhoFor } from "../content/workshops"
import { workshopCardPhotos } from "../content/workshopCardPhotos"

// Reuses the exact same card as the Workshops pillar page, fed by the same
// `workshops` content — so editing a workshop's title/teaser/"Who" row
// automatically updates this section too, rather than maintaining separate
// copy here. Both read `upcomingWorkshopSlugs`, so what's on here and what's
// on the pillar page can't drift apart.
export default function UpcomingWorkshop() {
  const upcoming = upcomingWorkshopSlugs
    .map((slug) => ({ workshop: workshops[slug], photo: workshopCardPhotos[slug] }))
    // A slug gated off by a feature flag drops out of `workshops` entirely.
    .filter((entry) => entry.workshop && entry.photo)

  if (upcoming.length === 0) return null

  return (
    <section id="workshops" className="bg-[var(--gn-acid)]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Eyebrow tone="onLight" className="mb-8 self-start">
          What's coming up
        </Eyebrow>

        {/* .gn-card (the offset-shadow treatment) is for the ONE featured
            card on a page. With two programs on now, neither is "the" one,
            so both go flat and the section's orange fill does the work of
            drawing the eye instead. Restore `className="gn-card !p-0"` on a
            single card if this ever drops back to one program. */}
        <div
          className={`grid grid-cols-1 gap-8 ${
            upcoming.length > 1 ? "md:grid-cols-2" : "max-w-md"
          }`}
        >
          {upcoming.map(({ workshop, photo }) => (
            <WorkshopCard
              key={workshop.slug}
              status="live"
              href={`/workshops/${workshop.slug}`}
              title={workshop.title}
              blurb={workshop.teaser}
              whoFor={workshopWhoFor(workshop.slug)}
              photoSrc={photo.src}
              photoAlt={photo.alt}
              photoObjectPosition={photo.objectPosition}
              className={upcoming.length === 1 ? "gn-card !p-0" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
