// Single source of truth for the "What's Coming Up" program card on
// /school-holiday-music-camp-perth AND the Event JSON-LD on that same page —
// both read from this one object, so the schema can never drift from what a
// visitor actually sees. Drop in the next program here when this one wraps.

export type UpcomingProgram = {
  title: string
  price: number
  priceLabel: string
  scholarshipNote: string
  rows: { label: string; value: string }[]
  ages: string
  ctaLabel: string
  ctaHref: string
  refundNote: string
  venueName: string
  venueAddress: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  // Event JSON-LD fields — ISO 8601 with explicit +08:00 (WA does not
  // observe daylight saving, so this offset never changes).
  startDateISO: string
  endDateISO: string
  validFromISO: string
  eventDescription: string
  /** Event JSON-LD offers.url — the funnel hand-off page, same as ctaHref
      (the conversion page at /workshops/2026-spring-holidays), not the raw
      Stripe booking form. Keeps the SEO page, the card CTA and the schema
      all pointing at one destination. */
  bookingUrl: string
}

export const upcomingProgram: UpcomingProgram = {
  title: "2026 Spring Holidays Jam Program",
  price: 80,
  priceLabel: "for both days · Foundation Price",
  scholarshipNote: "Free and part-scholarships available — no questions asked.",
  rows: [
    { label: "When", value: "Wed, 30 Sep – Thu, 1 Oct 2026" },
    { label: "Time", value: "9am – 3pm each day" },
    {
      label: "Where",
      value: "Player 1 Music School\n5 Woodville Lane, North Perth WA 6006",
    },
    { label: "Who", value: "Ages 14–17" },
  ],
  ages: "14-17",
  ctaLabel: "View full program & book",
  ctaHref: "/workshops/2026-spring-holidays",
  refundNote: "Refund for cancellations 2+ weeks before.",
  venueName: "Player 1 Music School",
  venueAddress: {
    streetAddress: "5 Woodville Lane",
    addressLocality: "North Perth",
    addressRegion: "WA",
    postalCode: "6006",
    addressCountry: "AU",
  },
  startDateISO: "2026-09-30T09:00:00+08:00",
  endDateISO: "2026-10-01T15:00:00+08:00",
  validFromISO: "2026-08-01T00:00:00+08:00",
  eventDescription:
    "A two-day school holiday music camp in Perth for ages 14–17. A small group writes an original song and jams it out together — no theory, no assessment, no solos.",
  bookingUrl: "https://goodnoiseproject.com.au/workshops/2026-spring-holidays",
}
