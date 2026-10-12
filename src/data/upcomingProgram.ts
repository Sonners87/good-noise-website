// Single source of truth for the "What's Coming Up" program card on
// /school-holiday-music-camp-perth AND the Event JSON-LD on that same page —
// both read from this one object, so the schema can never drift from what a
// visitor actually sees. Drop in the next program here when this one wraps.

export type UpcomingProgram = {
  title: string
  /** null until confirmed — the card shows "TBA". */
  price: number | null
  priceLabel: string
  scholarshipNote: string
  rows: { label: string; value: string }[]
  ages: string
  ctaLabel: string
  ctaHref: string
  refundNote?: string
  /** Event JSON-LD. null while dates/venue are TBA — the page then emits no
      Event markup at all, rather than markup with made-up dates. Dates are
      ISO 8601 with explicit +08:00 (WA does not observe daylight saving). */
  event: {
    venueName: string
    venueAddress: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
    startDateISO: string
    endDateISO: string
    validFromISO: string
    eventDescription: string
    soldOut: boolean
  } | null
  /** Event JSON-LD offers.url — the funnel hand-off page, same as ctaHref
      (the program's /workshops/<slug> conversion page), not the raw
      Stripe booking form. Keeps the SEO page, the card CTA and the schema
      all pointing at one destination. */
  bookingUrl: string
}

export const upcomingProgram: UpcomingProgram = {
  title: "2026 Christmas Holidays Jam Program",
  price: null,
  priceLabel: "for both days · price to be announced",
  scholarshipNote: "Free and part-scholarships available — no questions asked.",
  rows: [
    { label: "When", value: "Summer holidays 2026–27\n(dates TBA)" },
    { label: "Time", value: "TBA" },
    { label: "Where", value: "Perth (venue TBA)" },
    { label: "Who", value: "Ages 13–17" },
  ],
  ages: "13-17",
  ctaLabel: "Register your interest",
  ctaHref: "/workshops/christmas-holidays-jam-program#register-interest",
  event: null,
  bookingUrl: "https://goodnoiseproject.com.au/workshops/christmas-holidays-jam-program",
}
